import type { RankState } from './ranks'

const prestigeBadgeIds: Record<string, string> = {
  'Cultural Immortal': 'cultural-immortal',
  'Living Archive I': 'living-archive-i',
  'Living Archive II': 'living-archive-ii',
  'Living Archive III': 'living-archive-iii',
  'Living Archive IV': 'living-archive-iv',
  'Living Archive V': 'living-archive-v',
}

export const getRankBadgeImageId = (state: RankState): string =>
  state.prestigeTitle
    ? (prestigeBadgeIds[state.prestigeTitle] ?? state.displayRank.id)
    : state.displayRank.id
