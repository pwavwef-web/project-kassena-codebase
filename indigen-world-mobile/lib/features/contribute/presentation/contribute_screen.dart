import 'package:flutter/material.dart';

import '../../../core/models/content_models.dart';
import '../../../core/persistence/local_store.dart';
import '../../../core/widgets/feature_scaffold.dart';

class ContributeScreen extends StatefulWidget {
  const ContributeScreen({super.key});

  @override
  State<ContributeScreen> createState() => _ContributeScreenState();
}

class _ContributeScreenState extends State<ContributeScreen> {
  final _wordController = TextEditingController();
  final _translationController = TextEditingController();
  final _sentenceController = TextEditingController();
  final _proverbController = TextEditingController();
  final _noteController = TextEditingController();
  final _dialectController = TextEditingController();
  final _sourceController = TextEditingController();
  bool _consent = false;
  String _state = 'No local draft saved yet.';

  @override
  void dispose() {
    _wordController.dispose();
    _translationController.dispose();
    _sentenceController.dispose();
    _proverbController.dispose();
    _noteController.dispose();
    _dialectController.dispose();
    _sourceController.dispose();
    super.dispose();
  }

  Future<void> _saveDraft() async {
    final draft = ContributionDraft(
      word: _wordController.text,
      translation: _translationController.text,
      sentence: _sentenceController.text,
      proverb: _proverbController.text,
      culturalNote: _noteController.text,
      dialect: _dialectController.text,
      source: _sourceController.text,
      hasConsent: _consent,
    );
    await localStore.saveContributionDraft(draft);
    setState(() {
      _state = _consent
          ? 'Draft saved locally with consent acknowledgement.'
          : 'Draft saved locally, but consent is still pending.';
    });
  }

  @override
  Widget build(BuildContext context) {
    return FeatureScaffold(
      title: 'Contribute',
      subtitle:
          'Submit word, translation, sentence, proverb, cultural note, dialect, source, consent and audio placeholder as a local draft.',
      children: <Widget>[
        InfoCard(
          title: 'Local contribution draft',
          child: Column(
            children: <Widget>[
              _Field(controller: _wordController, label: 'Word'),
              _Field(controller: _translationController, label: 'Translation'),
              _Field(controller: _sentenceController, label: 'Sentence'),
              _Field(controller: _proverbController, label: 'Proverb'),
              _Field(
                  controller: _noteController,
                  label: 'Cultural note',
                  maxLines: 3),
              _Field(controller: _dialectController, label: 'Dialect'),
              _Field(controller: _sourceController, label: 'Source'),
              SwitchListTile(
                value: _consent,
                onChanged: (value) => setState(() => _consent = value),
                title: const Text('Consent acknowledgement'),
                subtitle: const Text('Required before review or publication.'),
              ),
              const ListTile(
                leading: Icon(Icons.mic_none_outlined),
                title: Text('Audio placeholder'),
                subtitle: Text('Audio recording and upload are coming soon.'),
              ),
              const SizedBox(height: 8),
              FilledButton.icon(
                onPressed: _saveDraft,
                icon: const Icon(Icons.save_outlined),
                label: const Text('Save local draft'),
              ),
              const SizedBox(height: 12),
              Text(_state),
            ],
          ),
        ),
      ],
    );
  }
}

class _Field extends StatelessWidget {
  const _Field({
    required this.controller,
    required this.label,
    this.maxLines = 1,
  });

  final TextEditingController controller;
  final String label;
  final int maxLines;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }
}
