import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude parameters are required" },
      { status: 400 }
    );
  }

  try {
    // Verwende BigDataCloud Reverse Geocoding API (kostenlos, kein API-Key erforderlich)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=de`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Fallback: Koordinaten als Name zurückgeben
      return NextResponse.json({
        name: `${parseFloat(latitude).toFixed(4)}°N, ${parseFloat(
          longitude
        ).toFixed(4)}°E`,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
    }

    const data = await response.json();

    // BigDataCloud gibt verschiedene Ortsnamen zurück, wir wählen den besten aus
    const name = data.city;

    return NextResponse.json({
      name: name,
      country: data.countryName,
      admin1: data.principalSubdivision, // Bundesland/Region
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    // Fallback bei Fehler
    return NextResponse.json({
      name: `${parseFloat(latitude).toFixed(4)}°N, ${parseFloat(
        longitude
      ).toFixed(4)}°E`,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
  }
}
