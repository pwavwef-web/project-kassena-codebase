import '../models/content_models.dart';

class DemoRepository {
  const DemoRepository();

  List<DictionaryEntry> get dictionaryEntries => const <DictionaryEntry>[
        DictionaryEntry(
          english: 'water',
          kasem: 'koom',
          partOfSpeech: 'noun',
          dialect: 'Kasem demo dialect note',
          example: 'Unverified demo sentence for learning UI only.',
          pronunciation: 'audio coming soon',
          source: 'Unverified Demo Data',
          tier: ContentTier.open,
        ),
        DictionaryEntry(
          english: 'thank you',
          kasem: 'baarika',
          partOfSpeech: 'phrase',
          dialect: 'Kasem demo dialect note',
          example: 'Placeholder example awaiting community validation.',
          pronunciation: 'audio coming soon',
          source: 'Demo Contributor',
          tier: ContentTier.open,
        ),
        DictionaryEntry(
          english: 'story',
          kasem: 'demo story word',
          partOfSpeech: 'noun',
          dialect: 'Needs validator confirmation',
          example:
              'Sample entry demonstrates metadata, not language authority.',
          pronunciation: 'audio coming soon',
          source: 'Unverified Demo Data',
          tier: ContentTier.open,
        ),
      ];

  List<CulturalItem> get culturalItems => const <CulturalItem>[
        CulturalItem(
          title: 'Placeholder Story',
          kind: 'Story',
          summary: 'Public summary card for a story awaiting source review.',
          attribution: 'Demo Contributor',
          context: 'Cultural context is summarized without private details.',
          classification: 'Restricted',
          tier: ContentTier.restricted,
        ),
        CulturalItem(
          title: 'Sample Proverb Card',
          kind: 'Proverb',
          summary:
              'Proverb metadata placeholder. Text is omitted until approved.',
          attribution: 'Sample Validator',
          context: 'Semantic meaning requires validator notes.',
          classification: 'Restricted',
          tier: ContentTier.restricted,
        ),
        CulturalItem(
          title: 'Heritage location placeholder',
          kind: 'Cultural site',
          summary: 'A location card that avoids exposing non-public places.',
          attribution: 'Unverified Demo Data',
          context: 'Exact location hidden in this demo.',
          classification: 'Sensitive',
          tier: ContentTier.sensitive,
        ),
        CulturalItem(
          title: 'Artefact note placeholder',
          kind: 'Artefact',
          summary:
              'Educational artefact note shape with permitted-use metadata.',
          attribution: 'Example Community',
          context: 'Public teaching summary only.',
          classification: 'Open',
          tier: ContentTier.open,
        ),
      ];

  List<LearningModule> get learningModules => const <LearningModule>[
        LearningModule(
          title: 'Beginner phrases',
          category: 'greetings',
          items: <String>['hello', 'thank you', 'good morning'],
          progress: 0.58,
        ),
        LearningModule(
          title: 'Family words',
          category: 'family',
          items: <String>['mother', 'father', 'child'],
          progress: 0.32,
        ),
        LearningModule(
          title: 'Food and travel',
          category: 'food',
          items: <String>['water', 'market', 'road'],
          progress: 0.21,
        ),
        LearningModule(
          title: 'Cultural etiquette',
          category: 'etiquette',
          items: <String>[
            'greeting elders',
            'public thanks',
            'careful questions'
          ],
          progress: 0.44,
        ),
      ];

  RewardSummary get rewards => const RewardSummary(
        points: 840,
        level: 'Language Steward',
        badges: <String>['First Word', 'Story Weaver', 'Dialect Guardian'],
        challenges: <String>[
          'Save three words offline',
          'Complete greetings flashcards',
          'Submit one local draft',
        ],
      );

  DictionaryEntry searchDictionary(String query,
      {required bool englishToKasem}) {
    final normalized = query.trim().toLowerCase();
    if (normalized.isEmpty) {
      return dictionaryEntries.first;
    }

    return dictionaryEntries.firstWhere(
      (entry) {
        final haystack = englishToKasem ? entry.english : entry.kasem;
        return haystack.toLowerCase().contains(normalized);
      },
      orElse: () => dictionaryEntries.first,
    );
  }
}

const DemoRepository demoRepository = DemoRepository();
