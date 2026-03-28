import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DaleDele",
    short_name: "DaleDele",
    description: "Practica español DELE B2",
    start_url: "/practicar",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#E8590C",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
