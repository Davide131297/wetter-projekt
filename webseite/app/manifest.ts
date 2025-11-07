import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wetter-App - Wettervorhersage",
    short_name: "Wetter-App",
    description:
      "Ihre zuverlässige Wettervorhersage für jeden Standort weltweit",
    start_url: "/",
    display: "standalone",
    background_color: "#0ea5e9",
    theme_color: "#0ea5e9",
    icons: [
      {
        src: "/WeatherLogo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
