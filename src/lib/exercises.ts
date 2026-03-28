export type ExerciseType = "choice" | "write";

export interface Exercise {
  sentence: string; // with ___ for the blank
  options?: string[]; // for choice mode
  answer: string;
  explanation: string;
  type: ExerciseType;
  hint?: string; // e.g. "(verbo: decir)" shown for write exercises
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  exercises: Exercise[];
}

export const CATEGORIES: Category[] = [
  {
    id: "subjuntivo",
    name: "Subjuntivo",
    emoji: "🎭",
    description: "Indicativo vs Subjuntivo",
    exercises: [
      { sentence: "Espero que ___ bien el examen.", options: ["hagas", "haces", "harás", "hiciste"], answer: "hagas", explanation: "'Esperar que' siempre va seguido de subjuntivo porque expresa deseo.", type: "choice" },
      { sentence: "No creo que ___ razón.", options: ["tengas", "tienes", "tendrás", "tuviste"], answer: "tengas", explanation: "'No creer que' expresa duda → subjuntivo.", type: "choice" },
      { sentence: "Busco a alguien que ___ francés.", options: ["hable", "habla", "hablará", "habló"], answer: "hable", explanation: "Cuando buscamos algo indefinido/que no sabemos si existe → subjuntivo.", type: "choice" },
      { sentence: "Me alegra que ___ aquí.", options: ["estés", "estás", "estarás", "estuviste"], answer: "estés", explanation: "'Alegrarse de que' expresa emoción → subjuntivo.", type: "choice" },
      { sentence: "Aunque ___ mucho, iremos a la playa.", options: ["llueva", "llueve", "lloverá", "llovió"], answer: "llueva", explanation: "'Aunque' + subjuntivo indica que no importa si ocurre o no (concesión hipotética).", type: "choice" },
      { sentence: "Es necesario que ___ más.", options: ["estudies", "estudias", "estudiarás", "estudiaste"], answer: "estudies", explanation: "'Es necesario que' es una estructura impersonal de obligación → subjuntivo.", type: "choice" },
      { sentence: "Quiero que me ___ la verdad.", answer: "digas", explanation: "'Querer que' expresa deseo sobre otra persona → subjuntivo del verbo 'decir'.", type: "write" },
      { sentence: "Dudo que ___ a tiempo.", answer: "llegue", explanation: "'Dudar que' expresa duda → subjuntivo del verbo 'llegar'.", type: "write" },
      { sentence: "Ojalá ___ buen tiempo mañana.", options: ["haga", "hace", "hará", "hizo"], answer: "haga", explanation: "'Ojalá' siempre va con subjuntivo.", type: "choice" },
      { sentence: "Cuando ___ a casa, te llamo.", options: ["llegue", "llego", "llegaré", "llegué"], answer: "llegue", explanation: "'Cuando' + acción futura → subjuntivo.", type: "choice" },
      { sentence: "No es verdad que Juan ___ rico.", options: ["sea", "es", "será", "fue"], answer: "sea", explanation: "Negar una realidad ('no es verdad que') → subjuntivo.", type: "choice" },
      { sentence: "Te lo digo para que lo ___.", options: ["sepas", "sabes", "sabrás", "supiste"], answer: "sepas", explanation: "'Para que' expresa finalidad → siempre subjuntivo.", type: "choice" },
    ],
  },
  {
    id: "pasados",
    name: "Pretérito vs Imperfecto",
    emoji: "⏰",
    description: "Indefinido vs Imperfecto",
    exercises: [
      { sentence: "Ayer ___ al cine con mis amigos.", options: ["fui", "iba", "he ido", "iría"], answer: "fui", explanation: "Acción puntual completada en el pasado (ayer) → pretérito indefinido.", type: "choice" },
      { sentence: "Cuando era niño, ___ al parque todos los días.", options: ["iba", "fui", "he ido", "iré"], answer: "iba", explanation: "Acción habitual/repetida en el pasado → imperfecto.", type: "choice" },
      { sentence: "Mientras yo ___, sonó el teléfono.", options: ["dormía", "dormí", "he dormido", "dormiré"], answer: "dormía", explanation: "Acción en progreso interrumpida por otra → imperfecto para la acción de fondo.", type: "choice" },
      { sentence: "___ las ocho cuando llegamos.", options: ["Eran", "Fueron", "Han sido", "Serán"], answer: "Eran", explanation: "Describir la hora en el pasado → imperfecto.", type: "choice" },
      { sentence: "El año pasado ___ a España tres veces.", options: ["viajé", "viajaba", "he viajado", "viajaría"], answer: "viajé", explanation: "Acción completada con número específico ('tres veces') → indefinido.", type: "choice" },
      { sentence: "De pequeña ___ el pelo largo.", answer: "tenía", explanation: "Descripción física en el pasado → imperfecto del verbo 'tener'.", type: "write" },
      { sentence: "Ayer por la mañana ___ mucho frío.", answer: "hacía", explanation: "Descripción del tiempo atmosférico en el pasado → imperfecto de 'hacer'.", type: "write" },
      { sentence: "La fiesta ___ muy divertida.", options: ["fue", "era", "ha sido", "sería"], answer: "fue", explanation: "Valoración global de un evento terminado → indefinido.", type: "choice" },
      { sentence: "Antes ___ mucho, pero ahora no puedo.", options: ["leía", "leí", "he leído", "leeré"], answer: "leía", explanation: "'Antes' indica hábito en el pasado → imperfecto.", type: "choice" },
      { sentence: "Anoche no ___ bien.", answer: "dormí", explanation: "Acción completada anoche → pretérito indefinido de 'dormir'.", type: "write" },
    ],
  },
  {
    id: "estaba-estuvo",
    name: "Estaba vs Estuvo",
    emoji: "🔄",
    description: "Imperfecto vs Indefinido de estar",
    exercises: [
      { sentence: "La puerta ___ abierta cuando llegué.", options: ["estaba", "estuvo"], answer: "estaba", explanation: "Estado que ya existía cuando ocurrió otra acción → imperfecto.", type: "choice" },
      { sentence: "___ enfermo tres días.", options: ["Estuvo", "Estaba"], answer: "Estuvo", explanation: "Duración definida y completada ('tres días') → indefinido.", type: "choice" },
      { sentence: "Mientras ___ en Madrid, visité el Prado.", options: ["estaba", "estuvo"], answer: "estaba", explanation: "Acción de fondo/contexto temporal → imperfecto.", type: "choice" },
      { sentence: "___ muy contenta cuando recibió la noticia.", options: ["Estaba", "Estuvo"], answer: "Estaba", explanation: "Estado emocional en un momento puntual del pasado → imperfecto (describe).", type: "choice" },
      { sentence: "Mi hermano ___ en el hospital dos semanas.", options: ["estuvo", "estaba"], answer: "estuvo", explanation: "Período cerrado y terminado ('dos semanas') → indefinido.", type: "choice" },
      { sentence: "La reunión ___ aburrida.", options: ["estuvo", "estaba"], answer: "estuvo", explanation: "Valoración de un evento terminado → indefinido.", type: "choice" },
      { sentence: "Cuando era joven, siempre ___ de buen humor.", options: ["estaba", "estuvo"], answer: "estaba", explanation: "Estado habitual en el pasado → imperfecto.", type: "choice" },
      { sentence: "___ lloviendo toda la noche.", options: ["Estuvo", "Estaba"], answer: "Estuvo", explanation: "Acción con duración definida completada ('toda la noche') → indefinido.", type: "choice" },
      { sentence: "¿Dónde ___ ayer a las 5?", answer: "estabas", explanation: "Preguntar por un estado en un momento específico del pasado → imperfecto.", type: "write" },
      { sentence: "María ___ muy nerviosa antes del examen.", answer: "estaba", explanation: "Estado emocional como contexto/descripción → imperfecto.", type: "write" },
      { sentence: "El restaurante ___ cerrado cuando llegamos.", answer: "estaba", explanation: "Estado que encontramos al llegar → imperfecto.", type: "write" },
      { sentence: "Juan ___ en París solo una semana.", answer: "estuvo", explanation: "Duración cerrada y completada → indefinido.", type: "write" },
    ],
  },
  {
    id: "ser-estar",
    name: "Ser vs Estar",
    emoji: "⚖️",
    description: "Cuándo usar ser y cuándo estar",
    exercises: [
      { sentence: "María ___ aburrida en la clase.", options: ["está", "es"], answer: "está", explanation: "'Estar aburrida' = se aburre ahora. 'Ser aburrida' = su personalidad es aburrida.", type: "choice" },
      { sentence: "Esta paella ___ muy rica.", options: ["está", "es"], answer: "está", explanation: "Valorar comida que estás probando → estar.", type: "choice" },
      { sentence: "Mi hermano ___ médico.", options: ["es", "está"], answer: "es", explanation: "Profesión → ser.", type: "choice" },
      { sentence: "La fiesta ___ en casa de Juan.", options: ["es", "está"], answer: "es", explanation: "Ubicación de eventos → ser.", type: "choice" },
      { sentence: "Pedro ___ muy guapo hoy.", options: ["está", "es"], answer: "está", explanation: "'Estar guapo' = se ve guapo hoy (cambio). 'Ser guapo' = característica permanente.", type: "choice" },
      { sentence: "La mesa ___ de madera.", options: ["es", "está"], answer: "es", explanation: "Material → ser.", type: "choice" },
      { sentence: "¿___ listo para el examen?", options: ["Estás", "Eres"], answer: "Estás", explanation: "'Estar listo' = preparado. 'Ser listo' = inteligente.", type: "choice" },
      { sentence: "La fruta ___ verde.", answer: "está", explanation: "'Estar verde' = no madura todavía (estado temporal).", type: "write" },
      { sentence: "Mi abuelo ___ muy mayor.", answer: "es", explanation: "Edad/característica inherente → ser.", type: "write" },
      { sentence: "Hoy ___ a 15 de marzo.", answer: "estamos", explanation: "Fechas → estar.", type: "write" },
    ],
  },
  {
    id: "condicionales",
    name: "Condicionales",
    emoji: "🔮",
    description: "Si + subjuntivo + condicional",
    exercises: [
      { sentence: "Si ___ dinero, viajaría por el mundo.", options: ["tuviera", "tengo", "tendré", "tenía"], answer: "tuviera", explanation: "Condicional tipo 2 (hipotético): Si + imperfecto de subjuntivo + condicional.", type: "choice" },
      { sentence: "Si ___ antes, habrías llegado a tiempo.", options: ["hubieras salido", "salías", "saldrías", "sales"], answer: "hubieras salido", explanation: "Condicional tipo 3 (imposible/pasado): Si + pluscuamperfecto de subjuntivo.", type: "choice" },
      { sentence: "Si hace buen tiempo, ___ a la playa.", options: ["iremos", "iríamos", "fuéramos", "íbamos"], answer: "iremos", explanation: "Condicional tipo 1 (real/posible): Si + presente + futuro.", type: "choice" },
      { sentence: "Si yo ___ tú, estudiaría más.", options: ["fuera", "soy", "seré", "era"], answer: "fuera", explanation: "'Si yo fuera tú' es una expresión fija con imperfecto de subjuntivo.", type: "choice" },
      { sentence: "Si ___ más tiempo, habría terminado el libro.", answer: "hubiera tenido", explanation: "Condicional tipo 3: Si + hubiera + participio.", type: "write" },
      { sentence: "Si ___ español, podrías vivir en España.", answer: "hablaras", explanation: "Condicional tipo 2: Si + imperfecto de subjuntivo.", type: "write" },
      { sentence: "Haríamos una fiesta si ___ más espacio.", options: ["tuviéramos", "tenemos", "tendremos", "teníamos"], answer: "tuviéramos", explanation: "Condicional tipo 2: necesitamos imperfecto de subjuntivo después de 'si'.", type: "choice" },
      { sentence: "Si no ___ tanto, no estarías tan cansado.", options: ["trabajaras", "trabajas", "trabajarás", "trabajabas"], answer: "trabajaras", explanation: "Condicional tipo 2: hipótesis sobre el presente.", type: "choice" },
    ],
  },
  {
    id: "por-para",
    name: "Por vs Para",
    emoji: "↔️",
    description: "Cuándo usar por y cuándo para",
    exercises: [
      { sentence: "Este regalo es ___ ti.", options: ["para", "por"], answer: "para", explanation: "'Para' indica destinatario.", type: "choice" },
      { sentence: "Gracias ___ tu ayuda.", options: ["por", "para"], answer: "por", explanation: "'Por' indica causa/motivo de agradecimiento.", type: "choice" },
      { sentence: "Estudio español ___ trabajar en España.", options: ["para", "por"], answer: "para", explanation: "'Para' indica finalidad/objetivo.", type: "choice" },
      { sentence: "Pasamos ___ el parque.", options: ["por", "para"], answer: "por", explanation: "'Por' indica movimiento a través de un lugar.", type: "choice" },
      { sentence: "Cambié mi coche ___ uno nuevo.", options: ["por", "para"], answer: "por", explanation: "'Por' indica intercambio.", type: "choice" },
      { sentence: "___ mí, la mejor opción es quedarnos.", options: ["Para", "Por"], answer: "Para", explanation: "'Para mí' indica opinión personal.", type: "choice" },
      { sentence: "Lo hice ___ amor.", answer: "por", explanation: "'Por' indica causa/motivación.", type: "write" },
      { sentence: "Necesito el informe ___ el lunes.", answer: "para", explanation: "'Para' indica fecha límite/plazo.", type: "write" },
      { sentence: "___ ser extranjera, habla muy bien español.", options: ["Para", "Por"], answer: "Para", explanation: "'Para' + infinitivo indica contraste/concesión (considerando que...).", type: "choice" },
      { sentence: "El vuelo fue cancelado ___ la tormenta.", options: ["por", "para"], answer: "por", explanation: "'Por' indica causa.", type: "choice" },
    ],
  },
  {
    id: "conectores",
    name: "Conectores",
    emoji: "🔗",
    description: "Marcadores del discurso B2",
    exercises: [
      { sentence: "Estudié mucho; ___, aprobé el examen.", options: ["por lo tanto", "sin embargo", "aunque", "a pesar de"], answer: "por lo tanto", explanation: "'Por lo tanto' indica consecuencia lógica.", type: "choice" },
      { sentence: "Llovía mucho; ___, salimos a pasear.", options: ["sin embargo", "por lo tanto", "además", "es decir"], answer: "sin embargo", explanation: "'Sin embargo' indica contraste/oposición.", type: "choice" },
      { sentence: "___ de que estaba cansada, siguió trabajando.", options: ["A pesar", "Sin embargo", "Por lo tanto", "Además"], answer: "A pesar", explanation: "'A pesar de que' introduce una concesión.", type: "choice" },
      { sentence: "No solo habla español, ___ también portugués.", options: ["sino", "pero", "sin embargo", "aunque"], answer: "sino", explanation: "'No solo... sino también' es una estructura correlativa.", type: "choice" },
      { sentence: "Quiero ir; ___, no tengo dinero.", options: ["no obstante", "por lo tanto", "además", "es decir"], answer: "no obstante", explanation: "'No obstante' indica contraste (similar a 'sin embargo').", type: "choice" },
      { sentence: "Es vegetariana, ___ no come carne.", answer: "es decir", explanation: "'Es decir' introduce una aclaración o reformulación.", type: "write" },
      { sentence: "Me encanta el cine. ___, voy cada semana.", answer: "De hecho", explanation: "'De hecho' refuerza lo dicho anteriormente.", type: "write" },
      { sentence: "No me gusta el calor. ___, prefiero el invierno.", options: ["Por eso", "Sin embargo", "Además", "A pesar de"], answer: "Por eso", explanation: "'Por eso' indica consecuencia.", type: "choice" },
    ],
  },
  {
    id: "expresiones",
    name: "Expresiones",
    emoji: "💬",
    description: "Modismos y expresiones idiomáticas",
    exercises: [
      { sentence: "Ha metido la ___. No debería haber dicho eso.", options: ["pata", "mano", "cabeza", "nariz"], answer: "pata", explanation: "'Meter la pata' = cometer un error, decir algo inapropiado.", type: "choice" },
      { sentence: "Estoy hasta las ___ de este trabajo.", options: ["narices", "manos", "piernas", "orejas"], answer: "narices", explanation: "'Estar hasta las narices' = estar muy harto de algo.", type: "choice" },
      { sentence: "Me importa un ___.", options: ["pepino", "tomate", "limón", "plátano"], answer: "pepino", explanation: "'Me importa un pepino' = no me importa nada.", type: "choice" },
      { sentence: "Juan siempre da en el ___.", options: ["clavo", "punto", "centro", "blanco"], answer: "clavo", explanation: "'Dar en el clavo' = acertar, tener razón.", type: "choice" },
      { sentence: "Eso es ___.", answer: "pan comido", explanation: "'Pan comido' = algo muy fácil.", type: "write" },
      { sentence: "No tiene pelos en la ___.", answer: "lengua", explanation: "'No tener pelos en la lengua' = decir lo que piensa sin filtro.", type: "write" },
      { sentence: "Está lloviendo a ___.", options: ["cántaros", "mares", "ríos", "cubos"], answer: "cántaros", explanation: "'Llover a cántaros' = llover muchísimo.", type: "choice" },
      { sentence: "Tomar el ___ a alguien.", options: ["pelo", "brazo", "pie", "dedo"], answer: "pelo", explanation: "'Tomar el pelo' = burlarse de alguien, bromear.", type: "choice" },
    ],
  },
  {
    id: "preposiciones",
    name: "Verbos + Preposiciones",
    emoji: "🎯",
    description: "Verbos que exigen preposición",
    exercises: [
      { sentence: "Depende ___ ti.", options: ["de", "en", "a", "por"], answer: "de", explanation: "'Depender de' — siempre con 'de'.", type: "choice" },
      { sentence: "Insistió ___ pagar la cuenta.", options: ["en", "de", "a", "por"], answer: "en", explanation: "'Insistir en' — siempre con 'en'.", type: "choice" },
      { sentence: "Se arrepintió ___ haberlo dicho.", options: ["de", "en", "por", "a"], answer: "de", explanation: "'Arrepentirse de' — siempre con 'de'.", type: "choice" },
      { sentence: "Confío ___ ti.", options: ["en", "de", "a", "con"], answer: "en", explanation: "'Confiar en' — siempre con 'en'.", type: "choice" },
      { sentence: "Se dedica ___ la enseñanza.", answer: "a", explanation: "'Dedicarse a' — siempre con 'a'.", type: "write" },
      { sentence: "Soñé ___ ti anoche.", answer: "con", explanation: "'Soñar con' — siempre con 'con'.", type: "write" },
      { sentence: "Me acuerdo ___ aquella noche.", options: ["de", "en", "a", "con"], answer: "de", explanation: "'Acordarse de' — siempre con 'de'.", type: "choice" },
      { sentence: "Se quejó ___ el ruido.", options: ["de", "por", "en", "a"], answer: "de", explanation: "'Quejarse de' — siempre con 'de'.", type: "choice" },
    ],
  },
  {
    id: "pasiva",
    name: "Voz Pasiva y Se",
    emoji: "🔃",
    description: "Pasiva con ser, pasiva refleja, se impersonal",
    exercises: [
      { sentence: "El libro fue ___ por García Márquez.", options: ["escrito", "escribido", "escribió", "escribe"], answer: "escrito", explanation: "Pasiva con 'ser': ser + participio. 'Escribir' → 'escrito' (irregular).", type: "choice" },
      { sentence: "Se ___ español en 20 países.", options: ["habla", "hablan", "es hablado", "hablando"], answer: "habla", explanation: "Se impersonal + verbo en singular.", type: "choice" },
      { sentence: "Se ___ muchos libros en esta librería.", options: ["venden", "vende", "vendieron", "vendía"], answer: "venden", explanation: "Pasiva refleja: 'se' + verbo concordando con el sujeto ('libros' = plural).", type: "choice" },
      { sentence: "La casa fue ___ en 1920.", options: ["construida", "construido", "construyó", "construye"], answer: "construida", explanation: "Pasiva con ser: el participio concuerda con el sujeto ('casa' = femenino).", type: "choice" },
      { sentence: "Se ___ prohibido fumar aquí.", answer: "ha", explanation: "Se impersonal: 'Se ha prohibido' (verbo en singular).", type: "write" },
      { sentence: "Aquí se ___ bien.", answer: "vive", explanation: "Se impersonal para hablar de condiciones generales.", type: "write" },
    ],
  },
  {
    id: "tildes",
    name: "Tildes",
    emoji: "á",
    description: "Acentuación correcta",
    exercises: [
      { sentence: "¿Cuál es la forma correcta?", options: ["público", "publico", "publicó"], answer: "público", explanation: "'Público' (adjetivo/sustantivo) es esdrújula → siempre lleva tilde. 'Publico' = yo publico. 'Publicó' = él publicó.", type: "choice" },
      { sentence: "¿Cuál es correcta? 'Yo no ___ nada'", options: ["sé", "se"], answer: "sé", explanation: "'Sé' (con tilde) = yo sé (verbo saber). 'Se' (sin tilde) = pronombre reflexivo.", type: "choice" },
      { sentence: "¿Cuál es correcta? 'Dame ___ agua'", options: ["más", "mas"], answer: "más", explanation: "'Más' (con tilde) = cantidad. 'Mas' (sin tilde) = pero (arcaico).", type: "choice" },
      { sentence: "¿Cuál es correcta? 'No sé ___ quieres'", options: ["qué", "que"], answer: "qué", explanation: "'Qué' lleva tilde en preguntas y exclamaciones (directas e indirectas).", type: "choice" },
      { sentence: "¿Cuál es correcta? '___ casa es bonita'", options: ["Esta", "Está"], answer: "Esta", explanation: "'Esta' (sin tilde) = demostrativo. 'Está' (con tilde) = verbo estar.", type: "choice" },
      { sentence: "Escribe correctamente: 'el arbol'", answer: "el árbol", explanation: "'Árbol' es llana terminada en consonante que no es n/s → lleva tilde.", type: "write" },
      { sentence: "Escribe correctamente: 'la musica'", answer: "la música", explanation: "'Música' es esdrújula → siempre lleva tilde.", type: "write" },
      { sentence: "Escribe correctamente: 'el cafe'", answer: "el café", explanation: "'Café' es aguda terminada en vocal → lleva tilde.", type: "write" },
      { sentence: "¿Cuál es correcta? '___ vienes mañana?'", options: ["Tú", "Tu"], answer: "Tú", explanation: "'Tú' (con tilde) = pronombre personal. 'Tu' (sin tilde) = posesivo.", type: "choice" },
      { sentence: "Escribe correctamente: 'el telefono'", answer: "el teléfono", explanation: "'Teléfono' es esdrújula → siempre lleva tilde.", type: "write" },
    ],
  },
];

// Merge extra exercises
import { EXTRA_EXERCISES } from "./extra-exercises";
import { MORE_EXERCISES } from "./more-exercises";
CATEGORIES.forEach(cat => {
  const extras = EXTRA_EXERCISES[cat.id];
  if (extras) cat.exercises.push(...extras);
  const more = MORE_EXERCISES[cat.id];
  if (more) cat.exercises.push(...more);
});

// Auto-add hints to write exercises
CATEGORIES.forEach(cat => {
  cat.exercises.forEach(ex => {
    if (ex.type === "write" && !ex.hint) {
      // Try to extract a verb hint
      const verbMatch = ex.explanation.match(/(?:verbo|verb)\s+'(\w+)'/i);
      if (verbMatch) { ex.hint = `(verbo: ${verbMatch[1]})`; return; }
      // Category-specific hints
      if (cat.id === "ser-estar") ex.hint = "(ser o estar)";
      else if (cat.id === "estaba-estuvo") ex.hint = "(estaba o estuvo)";
      else if (cat.id === "por-para") ex.hint = "(por o para)";
      else if (cat.id === "conectores") ex.hint = "(escribe el conector)";
      else if (cat.id === "expresiones") ex.hint = "(completa la expresión)";
      else if (cat.id === "preposiciones") ex.hint = "(escribe la preposición)";
      else if (cat.id === "pasiva") ex.hint = "(completa la forma verbal)";
      else if (cat.id === "tildes") ex.hint = "(escribe con la tilde correcta)";
      else if (cat.id === "condicionales") ex.hint = "(conjuga el verbo)";
      else if (cat.id === "pasados") ex.hint = "(conjuga en el pasado correcto)";
      else if (cat.id === "subjuntivo") ex.hint = "(conjuga en subjuntivo)";
    }
  });
});
