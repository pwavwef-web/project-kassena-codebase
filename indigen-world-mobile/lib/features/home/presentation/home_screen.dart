import 'package:flutter/material.dart';

import '../../../core/data/demo_repository.dart';
import '../../../core/widgets/feature_scaffold.dart';
import '../../../l10n/app_strings.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final word = demoRepository.dictionaryEntries.first;
    final story = demoRepository.culturalItems.first;

    return FeatureScaffold(
      title: AppStrings.appName,
      subtitle: '${AppStrings.offline}. ${AppStrings.noProductionCalls}.',
      children: <Widget>[
        const InfoCard(
          title: 'Onboarding',
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: <Widget>[
              StatusChip(label: 'welcome', icon: Icons.waving_hand_outlined),
              StatusChip(label: 'interests', icon: Icons.interests_outlined),
              StatusChip(label: 'communities', icon: Icons.groups_outlined),
              StatusChip(label: 'languages', icon: Icons.translate_outlined),
              StatusChip(label: 'learning goals', icon: Icons.flag_outlined),
              StatusChip(
                  label: 'offline preference',
                  icon: Icons.offline_pin_outlined),
              StatusChip(
                  label: 'optional account concept',
                  icon: Icons.person_add_alt),
            ],
          ),
        ),
        InfoCard(
          title: 'Word of the day',
          trailing: const StatusChip(label: 'Open'),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(word.english,
                  style: Theme.of(context).textTheme.headlineSmall),
              Text(word.kasem, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              Text('${word.partOfSpeech} - ${word.dialect}'),
              Text(word.example),
            ],
          ),
        ),
        InfoCard(
          title: 'Featured story',
          trailing: const StatusChip(label: 'Restricted'),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(story.title, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 6),
              Text(story.summary),
              const SizedBox(height: 6),
              Text('Attribution: ${story.attribution}'),
            ],
          ),
        ),
        InfoCard(
          title: 'Continue learning',
          child: Column(
            children: demoRepository.learningModules
                .take(2)
                .map(
                  (module) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(module.title),
                        const SizedBox(height: 6),
                        LinearProgressIndicator(value: module.progress),
                      ],
                    ),
                  ),
                )
                .toList(),
          ),
        ),
        const InfoCard(
          title: 'Active challenge',
          child: Text(
              'Save three Kasem demo words offline. No remote sync is active.'),
        ),
        const InfoCard(
          title: 'Community spotlight',
          child: Text(
              'Project Kasena is the flagship Kasem programme. Future communities require governance approval before launch.'),
        ),
        const InfoCard(
          title: 'Saved content',
          child: Text(
              'Empty state: saved offline items appear here after using Explore.'),
        ),
      ],
    );
  }
}
