import 'package:flutter/material.dart';

import '../../../core/data/demo_repository.dart';
import '../../../core/models/content_models.dart';
import '../../../core/persistence/local_store.dart';
import '../../../core/widgets/feature_scaffold.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  bool _englishToKasem = true;
  String _query = 'water';
  String _saveState = 'Not saved offline';

  DictionaryEntry get _result => demoRepository.searchDictionary(
        _query,
        englishToKasem: _englishToKasem,
      );

  Future<void> _saveOffline() async {
    await localStore.saveDictionaryEntry(_result);
    setState(() => _saveState = 'Saved offline locally');
  }

  @override
  Widget build(BuildContext context) {
    final result = _result;

    return FeatureScaffold(
      title: 'Explore',
      subtitle:
          'Search communities, languages, stories, proverbs, cultural sites, artefacts and oral-history placeholders.',
      children: <Widget>[
        InfoCard(
          title: 'Project Kasena / Kasem module',
          trailing: StatusChip(
              label: _englishToKasem ? 'English to Kasem' : 'Kasem to English'),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              SegmentedButton<bool>(
                segments: const <ButtonSegment<bool>>[
                  ButtonSegment<bool>(value: true, label: Text('English')),
                  ButtonSegment<bool>(value: false, label: Text('Kasem')),
                ],
                selected: <bool>{_englishToKasem},
                onSelectionChanged: (values) {
                  setState(() => _englishToKasem = values.first);
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                initialValue: _query,
                decoration: const InputDecoration(
                  labelText: 'Search',
                  hintText: 'water, thank you, koom',
                  border: OutlineInputBorder(),
                ),
                onChanged: (value) => setState(() => _query = value),
              ),
              const SizedBox(height: 16),
              Text(result.english,
                  style: Theme.of(context).textTheme.headlineSmall),
              Text(result.kasem, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: <Widget>[
                  StatusChip(label: result.partOfSpeech),
                  StatusChip(label: result.dialect),
                  const StatusChip(
                      label: 'audio coming soon',
                      icon: Icons.volume_up_outlined),
                ],
              ),
              const SizedBox(height: 12),
              Text('Example: ${result.example}'),
              Text('Source: ${result.source}'),
              const SizedBox(height: 12),
              Row(
                children: <Widget>[
                  FilledButton.icon(
                    onPressed: _saveOffline,
                    icon: const Icon(Icons.download_done_outlined),
                    label: const Text('Save offline'),
                  ),
                  const SizedBox(width: 12),
                  OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.edit_note_outlined),
                    label: const Text('Suggest correction'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(_saveState),
            ],
          ),
        ),
        const InfoCard(
          title: 'Filters',
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: <Widget>[
              StatusChip(label: 'communities'),
              StatusChip(label: 'languages'),
              StatusChip(label: 'stories'),
              StatusChip(label: 'proverbs'),
              StatusChip(label: 'cultural sites'),
              StatusChip(label: 'artefacts'),
              StatusChip(label: 'oral history placeholders'),
            ],
          ),
        ),
        ...demoRepository.culturalItems.map(
          (item) => InfoCard(
            title: item.title,
            trailing: StatusChip(label: item.classification),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(item.kind),
                const SizedBox(height: 6),
                Text(item.summary),
                const SizedBox(height: 6),
                Text('Attribution: ${item.attribution}'),
                Text('Context: ${item.context}'),
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.share_outlined),
                  label: const Text('Share placeholder'),
                ),
              ],
            ),
          ),
        ),
        const InfoCard(
          title: 'Loading, empty and error states',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              LinearProgressIndicator(value: 0.64),
              SizedBox(height: 12),
              Text('Empty state: no approved oral-history media yet.'),
              Text(
                  'Error state: local content could not load. Retry from seeded data.'),
            ],
          ),
        ),
      ],
    );
  }
}
