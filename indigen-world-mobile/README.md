# Indigen World — Mobile

Consumer mobile application for **Indigen World**, built with Flutter.

> **Status:** starter shell only, **not yet compiled**. The migration
> environment had the Dart SDK but **no Flutter SDK**, so `flutter pub get`,
> `flutter analyze` and `flutter test` could not be run here. The Dart sources
> are hand-authored to standard Flutter conventions. Native `android/` and
> `ios/` folders must be generated (see below).

## Stack

Flutter · Dart · Material 3 · feature-first architecture

## Structure

```
lib/
  main.dart                      # entry point
  app/
    app.dart                     # MaterialApp, themes, routing wiring
    router.dart                  # named routes + onGenerateRoute
  core/
    theme/app_theme.dart         # Material 3 light/dark, brand seed colour
  features/
    home/presentation/           # placeholder home screen
    explore/presentation/        # placeholder explore screen
    profile/presentation/        # placeholder profile screen
    shell/presentation/          # bottom-navigation shell
test/
  widget_test.dart               # boots the app, asserts the home shell
assets/images/                   # asset directory (register in pubspec)
```

## First-time setup (requires Flutter)

```bash
cd indigen-world-mobile
flutter create . --platforms=android,ios   # generates android/ + ios/ (non-destructive)
flutter pub get
flutter analyze
flutter test
flutter run
```

## What exists

- Material 3 theming (light + dark, brand-seeded)
- Named-route foundation (dependency-free; swap for `go_router` later)
- Bottom-navigation shell with Home / Explore / Profile placeholders
- One widget test

## Notes

- `android/` and `ios/` currently contain placeholder READMEs only.
- Firebase wiring (`firebase_options.dart`, `google-services.json`,
  `GoogleService-Info.plist`) is intentionally absent and gitignored — add it
  via `flutterfire configure` during the real build.
