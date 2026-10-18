import 'package:flutter/material.dart';

import '../../../core/data/demo_repository.dart';
import '../../../core/widgets/feature_scaffold.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final rewards = demoRepository.rewards;

    return FeatureScaffold(
      title: 'Profile',
      subtitle:
          'Profile, interests, communities, languages, learning progress, contributions, saved content, privacy, consent and settings.',
      children: <Widget>[
        const InfoCard(
          title: 'Demo Contributor',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Community: Kasena / Kasem'),
              Text('Languages: Kasem, English'),
              Text('Interests: beginner lessons, stories, dialect notes'),
              Text('Optional account concept: not connected to Firebase Auth'),
            ],
          ),
        ),
        InfoCard(
          title: 'Rewards',
          trailing: StatusChip(label: rewards.level),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('${rewards.points} demo points'),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: rewards.badges
                    .map((badge) => StatusChip(
                        label: badge, icon: Icons.workspace_premium_outlined))
                    .toList(),
              ),
              const SizedBox(height: 12),
              const Text('No payout integration. Redemption is a placeholder.'),
            ],
          ),
        ),
        InfoCard(
          title: 'Challenges and leaderboard demo',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              ...rewards.challenges.map((challenge) => Text('- $challenge')),
              const SizedBox(height: 12),
              const Text(
                  'Leaderboard demonstration: Demo Contributor, Sample Validator, Example Community Member.'),
            ],
          ),
        ),
        const InfoCard(
          title: 'Privacy and consent',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Consent records are local placeholders in this MVP.'),
              Text(
                  'AI-training permission defaults to off until explicitly approved.'),
              Text('Commercial-use permission defaults to off.'),
            ],
          ),
        ),
        const InfoCard(
          title: 'Settings',
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: <Widget>[
              StatusChip(
                  label: 'dark-mode ready', icon: Icons.dark_mode_outlined),
              StatusChip(
                  label: 'offline indicators',
                  icon: Icons.offline_pin_outlined),
              StatusChip(
                  label: 'localisation structure',
                  icon: Icons.translate_outlined),
              StatusChip(
                  label: 'tablet-safe layout',
                  icon: Icons.tablet_android_outlined),
            ],
          ),
        ),
      ],
    );
  }
}
