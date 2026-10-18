# Indigen World Mobile

Flutter Material 3 MVP for the Indigen World consumer app.

## Navigation

Primary tabs:

- Home
- Explore
- Learn
- Contribute
- Profile

## Features

- Onboarding surface for welcome, interests, communities, languages, learning
  goals, offline preference and optional account concept.
- Home with word of the day, featured story, continue learning, active
  challenge, community spotlight and saved-content empty state.
- Explore with community/language/story/proverb/site/artefact filters, Project
  Kasena Kasem search, direction toggle, result metadata, pronunciation coming
  soon, suggest correction and save offline.
- Learn with beginner phrases, greetings, family, food/travel, etiquette,
  flashcards, quizzes and local progress.
- Contribute with word, translation, sentence, proverb, cultural note, dialect,
  source, consent, audio placeholder and local draft saving.
- Profile with interests, communities, languages, learning progress,
  contributions, saved content, privacy, consent, settings, rewards, badges,
  challenges and leaderboard demonstration.
- Local seeded data, local persistence abstraction, loading/empty/error states,
  offline indicators, dark-mode readiness, localization structure and
  tablet-safe layouts.
- Android and iOS native scaffolds generated with `flutter create`.

## State Management

The MVP uses `StatefulWidget` for screen-local UI state and
`LocalStore`/`MemoryLocalStore` as the persistence abstraction. This keeps the
feature screens independent of future storage or Firebase sync choices.

## Commands

```bash
flutter pub get
dart format lib test
flutter analyze
flutter test
flutter run
```

## Integrations

No production Firebase, analytics, payment or AI provider is initialized.
