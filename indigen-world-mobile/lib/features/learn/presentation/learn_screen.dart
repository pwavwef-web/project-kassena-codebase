import 'package:flutter/material.dart';

import '../../../core/data/demo_repository.dart';
import '../../../core/widgets/feature_scaffold.dart';

class LearnScreen extends StatefulWidget {
  const LearnScreen({super.key});

  @override
  State<LearnScreen> createState() => _LearnScreenState();
}

class _LearnScreenState extends State<LearnScreen> {
  bool _showAnswer = false;
  int _quizScore = 0;

  @override
  Widget build(BuildContext context) {
    final modules = demoRepository.learningModules;
    final flashcard = demoRepository.dictionaryEntries[1];

    return FeatureScaffold(
      title: 'Learn',
      subtitle:
          'Beginner phrases, greetings, family, food, travel, places, cultural etiquette, flashcards, quizzes and local progress.',
      children: <Widget>[
        ...modules.map(
          (module) => InfoCard(
            title: module.title,
            trailing: StatusChip(label: module.category),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: module.items
                      .map((item) => StatusChip(label: item))
                      .toList(),
                ),
                const SizedBox(height: 12),
                LinearProgressIndicator(value: module.progress),
                const SizedBox(height: 6),
                Text('${(module.progress * 100).round()}% local progress'),
              ],
            ),
          ),
        ),
        InfoCard(
          title: 'Flashcard',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                _showAnswer ? flashcard.kasem : flashcard.english,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 10),
              FilledButton.icon(
                onPressed: () => setState(() => _showAnswer = !_showAnswer),
                icon: const Icon(Icons.flip_outlined),
                label: Text(_showAnswer ? 'Show prompt' : 'Show answer'),
              ),
            ],
          ),
        ),
        InfoCard(
          title: 'Quiz',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const Text('Which demo word means "thank you"?'),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: <Widget>[
                  OutlinedButton(
                    onPressed: () => setState(() => _quizScore = 1),
                    child: const Text('baarika'),
                  ),
                  OutlinedButton(
                    onPressed: () => setState(() => _quizScore = 0),
                    child: const Text('koom'),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(_quizScore == 1
                  ? 'Correct in the local demo.'
                  : 'Choose an answer.'),
            ],
          ),
        ),
      ],
    );
  }
}
