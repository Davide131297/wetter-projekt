import 'package:flutter/material.dart';

/// App-weite Konstanten
class AppConstants {
  AppConstants._();

  // Farben
  static const Color primaryColor = Color(0xFF01A5FF);
  static const Color overlayLight = Colors.white;
  static const Color overlayDark = Colors.black26;

  // Opacity/Alpha Werte
  static const int overlayAlphaLight = 90;
  static const int overlayAlphaMedium = 95;

  // Spacing
  static const double spacingXS = 4.0;
  static const double spacingS = 8.0;
  static const double spacingM = 12.0;
  static const double spacingL = 16.0;
  static const double spacingXL = 24.0;

  // Border Radius
  static const double radiusS = 16.0;
  static const double radiusM = 24.0;

  // Widget-spezifische Größen
  static const double hourlyCardWidth = 100.0;
  static const double hourlyListHeight = 80.0;
  static const double stickyHeaderHeight = 220.0;

  // Limits
  static const int maxHourlyItems = 24;
}
