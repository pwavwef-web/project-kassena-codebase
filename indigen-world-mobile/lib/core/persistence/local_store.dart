import '../models/content_models.dart';

/// Local persistence boundary for the MVP.
///
/// State management is intentionally simple: screens own short-lived UI state
/// with StatefulWidget, while durable local data is accessed through this
/// abstraction. A real implementation can replace [MemoryLocalStore] with
/// shared_preferences, SQLite, Hive or Firebase-backed sync without changing
/// feature screens.
abstract class LocalStore {
  Future<void> saveDictionaryEntry(DictionaryEntry entry);
  Future<List<DictionaryEntry>> savedDictionaryEntries();
  Future<void> saveContributionDraft(ContributionDraft draft);
  Future<List<ContributionDraft>> contributionDrafts();
}

class MemoryLocalStore implements LocalStore {
  final List<DictionaryEntry> _savedEntries = <DictionaryEntry>[];
  final List<ContributionDraft> _drafts = <ContributionDraft>[];

  @override
  Future<void> saveDictionaryEntry(DictionaryEntry entry) async {
    if (!_savedEntries.any((item) => item.english == entry.english)) {
      _savedEntries.add(entry);
    }
  }

  @override
  Future<List<DictionaryEntry>> savedDictionaryEntries() async {
    return List<DictionaryEntry>.unmodifiable(_savedEntries);
  }

  @override
  Future<void> saveContributionDraft(ContributionDraft draft) async {
    _drafts.add(draft);
  }

  @override
  Future<List<ContributionDraft>> contributionDrafts() async {
    return List<ContributionDraft>.unmodifiable(_drafts);
  }
}

final LocalStore localStore = MemoryLocalStore();
