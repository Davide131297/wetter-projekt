"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Droplets,
  Wind,
  Gauge,
  CloudRain,
  Sun,
  Loader2,
  MapPin,
} from "lucide-react";
import WeatherInfoBox from "@/components/WeatherInfoBox";

interface WeatherData {
  current: {
    time: string;
    temperature: number;
    humidity: number;
    apparentTemperature: number;
    precipitation: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
  };
  hourly: {
    time: string[];
    temperature: number[];
    humidity: number[];
    precipitationProbability: number[];
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
    precipitationSum: number[];
    precipitationProbability: number[];
  };
}

interface LocationData {
  name: string;
  country?: string;
  admin1?: string;
}

function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: "Klar",
    1: "Überwiegend klar",
    2: "Teilweise bewölkt",
    3: "Bewölkt",
    45: "Neblig",
    48: "Neblig mit Reifablagerung",
    51: "Leichter Nieselregen",
    53: "Mäßiger Nieselregen",
    55: "Dichter Nieselregen",
    61: "Leichter Regen",
    63: "Mäßiger Regen",
    65: "Starker Regen",
    71: "Leichter Schneefall",
    73: "Mäßiger Schneefall",
    75: "Starker Schneefall",
    80: "Leichte Regenschauer",
    81: "Mäßige Regenschauer",
    82: "Starke Regenschauer",
    95: "Gewitter",
    96: "Gewitter mit leichtem Hagel",
    99: "Gewitter mit starkem Hagel",
  };
  return weatherCodes[code] || "Unbekannt";
}

function WeatherPageContent() {
  const searchParams = useSearchParams();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  useEffect(() => {
    if (!lat || !lon) {
      setError("Latitude und Longitude Parameter fehlen");
      setLoading(false);
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      setError("Ungültige Koordinaten");
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);

        // Fetch weather and location in parallel
        const [weatherResponse, locationResponse] = await Promise.all([
          fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`),
          fetch(
            `/api/reverse-geocoding?latitude=${latitude}&longitude=${longitude}`
          ),
        ]);

        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const weatherData = await weatherResponse.json();
        setWeather(weatherData);

        if (locationResponse.ok) {
          const locationData = await locationResponse.json();
          setLocation(locationData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500 mx-auto" />
          <p className="text-muted-foreground">Lade Wetterdaten...</p>
        </div>
      </div>
    );
  }

  if (error || !weather || !location || !lat || !lon) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="border border-red-200 rounded-lg bg-white shadow-md p-6">
          <p className="text-red-600">
            Fehler beim Laden der Wetterdaten: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-sky-100 to-blue-100 px-6 py-6 rounded-lg">
        <h1 className="text-4xl font-bold mb-2 text-sky-900 flex items-center gap-3">
          <MapPin className="h-8 w-8" />
          {location.name}
        </h1>
        <p className="text-sky-700 ml-11">
          {location.admin1 && ` ${location.admin1}`}
          {location.country && ` • ${location.country}`}
        </p>
      </div>

      {/* Aktuelles Wetter */}
      <div className="border border-sky-200 rounded-lg bg-white shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-sky-50 to-blue-50 px-6 py-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-sky-900">
            <Sun className="h-6 w-6 text-yellow-500" />
            Aktuelles Wetter
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(weather.current.time).toLocaleString("de-DE")}
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <WeatherInfoBox
              color="orange"
              title="Temperatur"
              value={`${weather.current.temperature.toFixed(1)}°C`}
              subtitle={`Gefühlt: ${weather.current.apparentTemperature.toFixed(
                1
              )}°C`}
            />
            <WeatherInfoBox
              color="blue"
              title={
                <>
                  <Droplets className="h-4 w-4 text-blue-500 inline" />{" "}
                  Luftfeuchtigkeit
                </>
              }
              value={`${weather.current.humidity.toFixed(0)}%`}
            />
            <WeatherInfoBox
              color="green"
              title={
                <>
                  <Wind className="h-4 w-4 text-green-500 inline" /> Wind
                </>
              }
              value={
                <>
                  {weather.current.windSpeed.toFixed(1)}{" "}
                  <span className="text-lg">km/h</span>
                </>
              }
              subtitle={`Richtung: ${weather.current.windDirection.toFixed(
                0
              )}°`}
            />
            <WeatherInfoBox
              color="purple"
              title={
                <>
                  <Gauge className="h-4 w-4 text-purple-500 inline" /> Luftdruck
                </>
              }
              value={
                <>
                  {weather.current.pressure.toFixed(0)}{" "}
                  <span className="text-lg">hPa</span>
                </>
              }
            />
          </div>
        </div>
      </div>

      {/* 7-Tage-Vorhersage */}
      <div className="border border-blue-200 rounded-lg bg-white shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <h2 className="text-2xl font-semibold text-blue-900">
            7-Tage-Vorhersage
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {weather.daily.time.map((dateStr, index) => (
              <div
                key={index}
                className="border-2 border-sky-200 rounded-lg p-4 space-y-2 bg-linear-to-br from-sky-50 to-blue-50 hover:shadow-lg transition-shadow"
              >
                <p className="font-semibold text-center text-sky-900">
                  {new Date(dateStr).toLocaleDateString("de-DE", {
                    weekday: "short",
                    day: "numeric",
                    month: "numeric",
                  })}
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  {getWeatherDescription(weather.daily.weatherCode[index])}
                </p>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {weather.daily.temperatureMax[index].toFixed(0)}°
                  </p>
                  <p className="text-lg text-blue-500">
                    {weather.daily.temperatureMin[index].toFixed(0)}°
                  </p>
                </div>
                {weather.daily.precipitationSum[index] > 0 && (
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-500" />
                    {weather.daily.precipitationSum[index].toFixed(1)} mm
                  </p>
                )}
                <p className="text-xs text-center text-sky-700 font-medium">
                  Regen:{" "}
                  {weather.daily.precipitationProbability[index].toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stündliche Vorhersage */}
      <div className="border border-indigo-200 rounded-lg bg-white shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-indigo-50 to-purple-50 px-6 py-4">
          <h2 className="text-2xl font-semibold text-indigo-900">
            Stündliche Vorhersage
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Nächste 24 Stunden
          </p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4">
              {weather.hourly.time.map((timeStr, index) => (
                <div
                  key={index}
                  className="border-2 border-indigo-200 rounded-lg p-3 min-w-[100px] space-y-2 bg-linear-to-br from-indigo-50 to-purple-50 hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-semibold text-center text-indigo-900">
                    {new Date(timeStr).toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xl font-bold text-center text-orange-600">
                    {weather.hourly.temperature[index].toFixed(1)}°C
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                    <Droplets className="h-3 w-3 inline text-blue-500" />{" "}
                    {weather.hourly.humidity[index].toFixed(0)}%
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                    <CloudRain className="h-3 w-3 inline text-blue-500" />{" "}
                    {weather.hourly.precipitationProbability[index].toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WeatherPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WeatherPageContent />
    </Suspense>
  );
}
