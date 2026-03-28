"use client";

import { useState, useRef, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ConfettiBurst } from "@/components/confetti";
import { CATEGORIES } from "@/lib/exercises";
import type { Exercise } from "@/lib/exercises";

interface ConfettiState { key: number; x: number; y: number }

export default function QuizPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const isChallenge = category === "desafio";
  const cat = CATEGORIES.find((c) => c.id === category);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [writeInput, setWriteInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiState | null>(null);
  const [bonusConfetti, setBonusConfetti] = useState<ConfettiState[]>([]);
  const [finished, setFinished] = useState(false);
  const confettiKey = useRef(0);

  useEffect(() => {
    let source: Exercise[];
    if (isChallenge) {
      const all = CATEGORIES.flatMap(c => c.exercises);
      source = [...all].sort(() => Math.random() - 0.5).slice(0, 20);
    } else if (cat) {
      source = [...cat.exercises].sort(() => Math.random() - 0.5).slice(0, 10);
    } else {
      return;
    }
    // Shuffle options within each exercise
    const shuffled = source.map(ex => ({
      ...ex,
      options: ex.options ? [...ex.options].sort(() => Math.random() - 0.5) : undefined,
    }));
    setExercises(shuffled);
  }, [category]);

  const checkAnswer = (answer: string, e?: React.MouseEvent) => {
    if (showExplanation) return;
    const ex = exercises[current];
    const correct = answer.trim().toLowerCase() === ex.answer.toLowerCase();
    setSelected(answer);
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Confetti
      if (e) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        confettiKey.current++;
        setConfetti({ key: confettiKey.current, x: rect.left + rect.width / 2, y: rect.top });
      } else {
        confettiKey.current++;
        setConfetti({ key: confettiKey.current, x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }

      if (newStreak === 3 || newStreak === 5 || newStreak === 7) {
        setTimeout(() => {
          const w = window.innerWidth, h = window.innerHeight;
          setBonusConfetti([{ x: w * 0.3, y: h * 0.3 }, { x: w * 0.7, y: h * 0.3 }].map((pos) => {
            confettiKey.current++; return { key: confettiKey.current, ...pos };
          }));
        }, 300);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setConfetti(null);
    setBonusConfetti([]);
    if (current + 1 >= exercises.length) {
      saveProgress();
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setWriteInput("");
      setIsCorrect(null);
      setShowExplanation(false);
    }
  };

  const handleWriteSubmit = () => {
    if (!writeInput.trim()) return;
    checkAnswer(writeInput.trim());
  };

  const saveProgress = async () => {
    if (isChallenge) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const finalScore = score + (isCorrect ? 1 : 0);
    const errors = exercises.length - finalScore;
    const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;

    const { data: existing } = await supabase
      .from("daledele_progress")
      .select("stars, times_played")
      .eq("user_id", user.id)
      .eq("category", category)
      .single();

    await supabase.from("daledele_progress").upsert({
      user_id: user.id,
      category,
      stars: Math.max(stars, existing?.stars || 0),
      best_streak: bestStreak,
      last_score: finalScore,
      times_played: (existing?.times_played || 0) + 1,
    }, { onConflict: "user_id,category" });

    if (errors === 0) {
      setTimeout(() => {
        const w = window.innerWidth, h = window.innerHeight;
        const positions = [{ x: w*0.5, y: h*0.2 }, { x: w*0.2, y: h*0.4 }, { x: w*0.8, y: h*0.4 }];
        const makeBursts = () => positions.map((pos) => { confettiKey.current++; return { key: confettiKey.current, ...pos }; });
        setBonusConfetti(makeBursts());
        setTimeout(() => setBonusConfetti(makeBursts()), 800);
        setTimeout(() => setBonusConfetti(makeBursts()), 1600);
      }, 300);
    }
  };

  if ((!cat && !isChallenge) || exercises.length === 0) return null;
  const catName = isChallenge ? "Desafío" : cat!.name;
  const catEmoji = isChallenge ? "🎯" : cat!.emoji;

  const ex = exercises[current];
  const finalScore = score;
  const errors = exercises.length - finalScore;
  const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;

  // Results screen
  if (finished) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4 animate-bounce-in">{stars === 3 ? "🏆" : stars === 2 ? "⭐" : "👏"}</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">¡{catName} completado!</h1>
        <p className="text-4xl font-bold spanish-shimmer mb-4">{finalScore}/{exercises.length}</p>
        <div className="flex justify-center gap-1 mb-4">
          {[1,2,3].map((s) => <span key={s} className={`text-3xl ${s <= stars ? "" : "opacity-20"}`}>⭐</span>)}
        </div>
        {bestStreak > 0 && <p className="text-sm text-muted mb-6">🔥 Mejor racha: {bestStreak}</p>}
        <div className="space-y-3 max-w-xs mx-auto">
          <button onClick={() => {
            const src = isChallenge
              ? CATEGORIES.flatMap(c => c.exercises).sort(() => Math.random()-0.5).slice(0,20)
              : [...cat!.exercises].sort(() => Math.random()-0.5).slice(0,10);
            setExercises(src.map(ex => ({ ...ex, options: ex.options ? [...ex.options].sort(() => Math.random()-0.5) : undefined })));
            setCurrent(0); setScore(0); setStreak(0); setBestStreak(0);
            setSelected(null); setWriteInput(""); setIsCorrect(null);
            setShowExplanation(false); setFinished(false);
          }} className="w-full bg-spanish text-white font-bold py-3 rounded-xl text-lg">
            ¡Jugar de nuevo!
          </button>
          <button onClick={() => router.push("/practicar")}
            className="w-full bg-surface border border-border text-foreground font-medium py-3 rounded-xl">
            Volver al menú
          </button>
        </div>
        {confetti && <ConfettiBurst key={confetti.key} x={confetti.x} y={confetti.y} onDone={() => setConfetti(null)} />}
        {bonusConfetti.map((c) => <ConfettiBurst key={c.key} x={c.x} y={c.y} onDone={() => setBonusConfetti((p) => p.filter((b) => b.key !== c.key))} />)}
      </div>
    );
  }

  // Render sentence with blank highlighted
  const parts = ex.sentence.split("___");
  const sentenceDisplay = parts.length > 1 ? (
    <p className="text-xl font-medium text-foreground leading-relaxed">
      {parts[0]}<span className="inline-block min-w-[60px] border-b-2 border-spanish mx-1">
        {showExplanation ? <span className={isCorrect ? "text-green-400" : "text-red-400"}>{ex.answer}</span> : " "}
      </span>{parts[1]}
    </p>
  ) : (
    <p className="text-xl font-medium text-foreground leading-relaxed">{ex.sentence}</p>
  );

  return (
    <div className="flex flex-col items-center">
      {/* Progress bar */}
      <div className="w-full bg-border rounded-full h-2 mb-6">
        <div className="bg-spanish h-2 rounded-full transition-all duration-300" style={{ width: `${(current / exercises.length) * 100}%` }} />
      </div>

      {streak > 0 && <div className="text-sm font-medium text-spanish mb-2 animate-bounce-in">🔥 Racha: {streak}</div>}

      {/* Emoji reaction */}
      <div className={`text-5xl mb-4 ${isCorrect === true ? "animate-jump" : isCorrect === false ? "animate-shake" : ""}`}>
        {isCorrect === true ? "😄" : isCorrect === false ? "😅" : (streak >= 3 ? "🤩" : "🤔")}
      </div>

      {/* Category badge */}
      <div className="text-xs text-muted mb-4">{catEmoji} {catName}</div>

      {/* Question */}
      <div className="text-center mb-6 px-4">{sentenceDisplay}</div>

      {/* Answer area */}
      {ex.type === "choice" && ex.options && (
        <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
          {ex.options.map((opt) => {
            let bg = "bg-surface border-border hover:border-spanish/50";
            if (showExplanation) {
              if (opt === ex.answer) bg = "bg-green-500/20 border-green-500";
              else if (opt === selected) bg = "bg-red-500/20 border-red-500";
            }
            return (
              <button key={opt} onClick={(e) => checkAnswer(opt, e)} disabled={showExplanation}
                className={`${bg} border rounded-xl py-4 px-4 text-left font-medium text-foreground transition-all active:scale-95 disabled:cursor-default`}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {ex.type === "write" && (
        <div className="w-full max-w-sm">
          {ex.hint && <p className="text-xs text-muted mb-2 text-center">{ex.hint}</p>}
          <input type="text" value={writeInput} onChange={(e) => setWriteInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !showExplanation && handleWriteSubmit()}
            disabled={showExplanation} autoFocus autoComplete="off" autoCapitalize="off"
            placeholder="Escribe tu respuesta..."
            className={`w-full border rounded-xl py-4 px-4 text-foreground text-lg outline-none ${
              showExplanation ? (isCorrect ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500") : "bg-surface border-border focus:border-spanish"
            }`} />
          {!showExplanation && (
            <button onClick={handleWriteSubmit} disabled={!writeInput.trim()}
              className="w-full mt-3 bg-spanish text-white font-bold py-3 rounded-xl disabled:opacity-40">
              Comprobar
            </button>
          )}
          {showExplanation && !isCorrect && (
            <p className="text-sm text-green-400 mt-2">Respuesta correcta: <strong>{ex.answer}</strong></p>
          )}
        </div>
      )}

      {/* Explanation + Next button */}
      {showExplanation && (
        <div className="w-full max-w-sm mt-4 animate-bounce-in">
          <div className={`p-4 rounded-xl border ${isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
            <p className="text-sm font-medium mb-1">{isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto"}</p>
            <p className="text-sm text-muted">{ex.explanation}</p>
          </div>
          <button onClick={handleNext}
            className="w-full mt-3 bg-spanish text-white font-bold py-3 rounded-xl text-lg">
            Siguiente →
          </button>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Pregunta {current + 1} de {exercises.length} · {score} correctas
      </p>

      {confetti && <ConfettiBurst key={confetti.key} x={confetti.x} y={confetti.y} onDone={() => setConfetti(null)} />}
      {bonusConfetti.map((c) => <ConfettiBurst key={c.key} x={c.x} y={c.y} onDone={() => setBonusConfetti((p) => p.filter((b) => b.key !== c.key))} />)}
    </div>
  );
}
