import 'package:flutter/material.dart';

import '../features/shell/presentation/home_shell.dart';

/// Lightweight routing foundation using named routes + [onGenerateRoute].
///
/// Kept dependency-free for the starter. Swap for `go_router` (or similar)
/// when nested/declarative routing is needed.
class AppRouter {
  AppRouter._();

  static const String initialRoute = home;

  static const String home = '/';

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case home:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => const HomeShell(),
        );
      default:
        return MaterialPageRoute<void>(
          settings: settings,
          builder: (_) => Scaffold(
            body: Center(
              child: Text('Route not found: ${settings.name}'),
            ),
          ),
        );
    }
  }
}
