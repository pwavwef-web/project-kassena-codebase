import 'package:flutter/material.dart';

/// Indigen World mobile theme (Material 3).
///
/// Seeded from the brand indigo. Extend with typography and component themes
/// as the design system matures.
class AppTheme {
  AppTheme._();

  static const Color _brandSeed = Color(0xFF2D3A8C); // indigo
  static const Color _accent = Color(0xFFC0573B); // terracotta

  static ThemeData light() {
    final scheme = ColorScheme.fromSeed(
      seedColor: _brandSeed,
      secondary: _accent,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: scheme.surface,
    );
  }

  static ThemeData dark() {
    final scheme = ColorScheme.fromSeed(
      seedColor: _brandSeed,
      secondary: _accent,
      brightness: Brightness.dark,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: scheme.surface,
    );
  }
}
