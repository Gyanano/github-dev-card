import { fetchUser, fetchRepos, fetchContributionCount } from './github';
import { computeDevCard } from './stats';
import { upsertLeaderboard } from './storage';
import { DevCard } from './types';

export async function generateCard(username: string): Promise<DevCard> {
  const [user, repos, activity] = await Promise.all([
    fetchUser(username),
    fetchRepos(username),
    fetchContributionCount(username),
  ]);

  const card = computeDevCard(user, repos, activity);

  // Save to leaderboard (fire and forget)
  upsertLeaderboard({
    username: card.username,
    avatarUrl: card.avatarUrl,
    name: card.name,
    rank: card.rank,
    totalPower: card.stats.totalPower,
    stats: card.stats,
    updatedAt: new Date().toISOString(),
  }).catch(() => {});

  return card;
}
