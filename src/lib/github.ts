import { GitHubUser, GitHubRepo } from './types';

const GITHUB_API = 'https://api.github.com';

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('User not found');
    if (res.status === 403) throw new Error('API rate limit exceeded. Please try again later.');
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return githubFetch<GitHubUser>(`/users/${username}`);
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (page <= 3) {
    const repos = await githubFetch<GitHubRepo[]>(
      `/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );
    allRepos.push(...repos);
    if (repos.length < perPage) break;
    page++;
  }

  return allRepos.filter(r => !r.fork);
}

export async function fetchContributionCount(username: string): Promise<number> {
  try {
    const events = await githubFetch<Array<{ type: string }>>(
      `/users/${username}/events?per_page=100`
    );
    return events.filter(e =>
      e.type === 'PushEvent' || e.type === 'PullRequestEvent' || e.type === 'CreateEvent'
    ).length;
  } catch {
    return 0;
  }
}
