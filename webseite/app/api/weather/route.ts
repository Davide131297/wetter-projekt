import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherApi } from "openmeteo";

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
    const params = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
        "pressure_msl",
      ],
      hourly: [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation_probability",
        "weather_code",
      ],
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "precipitation_probability_max",
      ],
      timezone: "Europe/Berlin",
      forecast_days: 7,
    };

    const responses = await fetchWeatherApi(
      "https://api.open-meteo.com/v1/forecast",
      params
    );
    const response = responses[0];

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Helper function to get values from range
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const weatherData = {
      current: {
        time: new Date(Number(current.time()) * 1000).toISOString(),
        temperature: current.variables(0)!.value(),
        humidity: current.variables(1)!.value(),
        apparentTemperature: current.variables(2)!.value(),
        precipitation: current.variables(3)!.value(),
        weatherCode: current.variables(4)!.value(),
        windSpeed: current.variables(5)!.value(),
        windDirection: current.variables(6)!.value(),
        pressure: current.variables(7)!.value(),
      },
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        )
          .slice(0, 24)
          .map((t) => new Date(t * 1000).toISOString()),
        temperature: range(0, 24, 1).map(
          (i) => hourly.variables(0)!.valuesArray()![i]
        ),
        humidity: range(0, 24, 1).map(
          (i) => hourly.variables(1)!.valuesArray()![i]
        ),
        precipitationProbability: range(0, 24, 1).map(
          (i) => hourly.variables(2)!.valuesArray()![i]
        ),
      },
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date(t * 1000).toISOString()),
        weatherCode: Array.from(daily.variables(0)!.valuesArray()!),
        temperatureMax: Array.from(daily.variables(1)!.valuesArray()!),
        temperatureMin: Array.from(daily.variables(2)!.valuesArray()!),
        precipitationSum: Array.from(daily.variables(3)!.valuesArray()!),
        precipitationProbability: Array.from(
          daily.variables(4)!.valuesArray()!
        ),
      },
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
