export interface HowItWorksStep {
  number: number
  title: string
  description: string
  icon: string
  actor: 'You' | 'Community' | 'System' | 'Validators' | 'Everyone'
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: 1,
    title: 'Search a word or phrase',
    description:
      'Someone looks up a Kasem word, phrase or meaning in the dictionary.',
    icon: 'search',
    actor: 'You',
  },
  {
    number: 2,
    title: 'Get validated information',
    description:
      'The platform returns reviewed language information — meaning, examples and dialect notes where available.',
    icon: 'book',
    actor: 'System',
  },
  {
    number: 3,
    title: 'Contribute knowledge',
    description:
      'Community members suggest translations, sentences, dialect variants or corrections.',
    icon: 'upload',
    actor: 'Community',
  },
  {
    number: 4,
    title: 'Automated checks',
    description:
      'Automated checks catch obvious errors and duplicates before review.',
    icon: 'refresh',
    actor: 'System',
  },
  {
    number: 5,
    title: 'Elder & teacher review',
    description:
      'Qualified Kasem teachers and elders review submissions for accuracy and appropriateness.',
    icon: 'shield',
    actor: 'Validators',
  },
  {
    number: 6,
    title: 'Enter the verified dataset',
    description:
      'Approved records join the verified dataset that powers the dictionary.',
    icon: 'data',
    actor: 'System',
  },
  {
    number: 7,
    title: 'Contributors are recognised',
    description:
      'Contributors receive points, achievements and eligible rewards for approved work.',
    icon: 'reward',
    actor: 'Community',
  },
  {
    number: 8,
    title: 'Power education, research & AI',
    description:
      'The verified dataset supports education, research, translation and future AI models.',
    icon: 'spark',
    actor: 'Everyone',
  },
]
