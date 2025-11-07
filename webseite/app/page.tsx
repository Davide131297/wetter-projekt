import { Cloud, MapPin, Sun, CloudRain, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="text-center space-y-6 max-w-4xl px-4">
        <div className="flex justify-center">
          <div className="relative">
            <Cloud className="h-24 w-24 text-sky-400 animate-pulse" />
            <Sun className="h-12 w-12 text-yellow-400 absolute -top-2 -right-2" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
          Wetter-App
        </h1>
        <p className="text-xl md:text-2xl text-sky-600 font-medium">
          Ihre zuverlässige Wettervorhersage für jeden Standort
        </p>
        <p className="text-muted-foreground text-lg">
          Suchen Sie nach einem Standort in der Navigationsleiste oben, um die
          aktuelle Wettervorhersage zu sehen.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <Card className="border-sky-200 bg-linear-to-br from-sky-50 to-blue-50">
            <CardContent className="pt-6 text-center">
              <Sun className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Aktuelle Daten</h3>
              <p className="text-sm text-muted-foreground">
                Echtzeit-Wetterdaten für jeden Ort
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6 text-center">
              <CloudRain className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">7-Tage-Vorhersage</h3>
              <p className="text-sm text-muted-foreground">
                Detaillierte Wetterprognose für die Woche
              </p>
            </CardContent>
          </Card>
          <Card className="border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50">
            <CardContent className="pt-6 text-center">
              <Wind className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Detaillierte Infos</h3>
              <p className="text-sm text-muted-foreground">
                Wind, Luftfeuchtigkeit, Luftdruck und mehr
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
