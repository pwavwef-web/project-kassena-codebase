enum ContentTier { open, restricted, sensitive }

enum ContributionStatus { draft, submitted, pendingReview, approved, rejected }

class DictionaryEntry {
  const DictionaryEntry({
    required this.english,
    required this.kasem,
    required this.partOfSpeech,
    required this.dialect,
    required this.example,
    required this.pronunciation,
    required this.source,
    required this.tier,
  });

  final String english;
  final String kasem;
  final String partOfSpeech;
  final String dialect;
  final String example;
  final String pronunciation;
  final String source;
  final ContentTier tier;
}

class CulturalItem {
  const CulturalItem({
    required this.title,
    required this.kind,
    required this.summary,
    required this.attribution,
    required this.context,
    required this.classification,
    required this.tier,
  });

  final String title;
  final String kind;
  final String summary;
  final String attribution;
  final String context;
  final String classification;
  final ContentTier tier;
}

class LearningModule {
  const LearningModule({
    required this.title,
    required this.category,
    required this.items,
    required this.progress,
  });

  final String title;
  final String category;
  final List<String> items;
  final double progress;
}

class ContributionDraft {
  const ContributionDraft({
    required this.word,
    required this.translation,
    required this.sentence,
    required this.proverb,
    required this.culturalNote,
    required this.dialect,
    required this.source,
    required this.hasConsent,
  });

  final String word;
  final String translation;
  final String sentence;
  final String proverb;
  final String culturalNote;
  final String dialect;
  final String source;
  final bool hasConsent;
}

class RewardSummary {
  const RewardSummary({
    required this.points,
    required this.level,
    required this.badges,
    required this.challenges,
  });

  final int points;
  final String level;
  final List<String> badges;
  final List<String> challenges;
}
