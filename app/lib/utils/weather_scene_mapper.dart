import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:weather_animation/weather_animation.dart';

WeatherScene chooseSceneForWeatherCode(int? code) {
  if (code == null) {
    return WeatherScene.sunset;
  }

  if (code == 0) {
    return WeatherScene.scorchingSun;
  }

  if (code == 1 || code == 2) {
    return WeatherScene.sunset;
  }

  if (code == 3) {
    return WeatherScene.rainyOvercast;
  }

  if (code >= 45 && code <= 48) {
    return WeatherScene.weatherEvery;
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 86)) {
    return WeatherScene.rainyOvercast;
  }

  if (code >= 71 && code <= 77) {
    return WeatherScene.snowfall;
  }

  if (code >= 95) {
    return WeatherScene.stormy;
  }

  return WeatherScene.sunset;
}

({Icon icon, String text}) describeWeather(int? code) {
  if (code == null) {
    return (icon: const Icon(Icons.help_outline), text: "Unbekannt");
  }

  if (code == 0) {
    return (
      icon: const Icon(CupertinoIcons.sun_max_fill, color: Colors.white),
      text: "Klar",
    );
  }
  if (code == 1 || code == 2) {
    return (
      icon: const Icon(CupertinoIcons.cloud_sun_fill, color: Colors.white),
      text: "Überwiegend klar",
    );
  }
  if (code == 3) {
    return (
      icon: const Icon(CupertinoIcons.cloud_fill, color: Colors.white),
      text: "Bedeckt",
    );
  }
  if (code == 45 || code == 48) {
    return (
      icon: const Icon(Icons.blur_on, color: Colors.white),
      text: "Nebel",
    );
  }
  if (code >= 51 && code <= 57) {
    return (
      icon: const Icon(Icons.grain, color: Colors.white),
      text: "Nieselregen",
    );
  }
  if (code >= 61 && code <= 67) {
    return (
      icon: const Icon(Icons.beach_access, color: Colors.white),
      text: "Regen",
    );
  }
  if (code >= 71 && code <= 77) {
    return (
      icon: const Icon(Icons.ac_unit, color: Colors.white),
      text: "Schnee",
    );
  }
  if (code >= 80 && code <= 82) {
    return (
      icon: const Icon(Icons.beach_access, color: Colors.white),
      text: "Schauer",
    );
  }
  if (code >= 85 && code <= 86) {
    return (
      icon: const Icon(Icons.ac_unit, color: Colors.white),
      text: "Schneeschauer",
    );
  }
  if (code >= 95 && code <= 99) {
    return (
      icon: const Icon(Icons.flash_on, color: Colors.white),
      text: "Gewitter",
    );
  }

  return (
    icon: const Icon(Icons.help_outline, color: Colors.white),
    text: "Unbekannt",
  );
}
