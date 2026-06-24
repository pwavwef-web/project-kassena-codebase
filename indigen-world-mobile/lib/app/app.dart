import 'package:flutter/material.dart';

import '../core/theme/app_theme.dart';
import 'router.dart';

/// Root application widget for Indigen World Mobile.
///
/// Material 3, light + dark themes, and a named-route foundation. The bottom
/// navigation shell is the home route; features are added under `lib/features`.
class IndigenWorldApp extends StatelessWidget {
  const IndigenWorldApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Indigen World',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: ThemeMode.system,
      initialRoute: AppRouter.initialRoute,
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}
