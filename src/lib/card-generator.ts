import { fetchUser, fetchRepos, fetchContributionCount } from './github';
import { computeDevCard } from './stats';
import { DevCard } from './types';

export async function generateCard(username: string): Promise<DevCard> {
  const [user, repos, activity] = await Promise.all([
    fetchUser(username),
    fetchRepos(username),
    fetchContributionCount(username),
  ]);

  return computeDevCard(user, repos, activity);
}
