import { GitHubUser, GitHubRepo, DevStats, DevCard } from './types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeAttack(repoCount: number, recentActivity: number, accountAgeDays: number): number {
  // Based on repo productivity and recent activity
  const repoScore = Math.min(repoCount / 50, 1) * 40;
  const activityScore = Math.min(recentActivity / 80, 1) * 40;
  const consistencyScore = Math.min(accountAgeDays / 1825, 1) * 20; // 5 years
  return clamp(Math.round(repoScore + activityScore + consistencyScore), 1, 99);
}

function computeDefense(totalStars: number, totalForks: number, repoCount: number): number {
  // Based on code quality indicators (stars, forks per repo)
  const avgStars = repoCount > 0 ? totalStars / repoCount : 0;
  const avgForks = repoCount > 0 ? totalForks / repoCount : 0;
  const starScore = Math.min(Math.log2(totalStars + 1) / 10, 1) * 50;
  const qualityScore = Math.min((avgStars + avgForks * 2) / 10, 1) * 30;
  const scaleScore = Math.min(totalForks / 100, 1) * 20;
  return clamp(Math.round(starScore + qualityScore + scaleScore), 1, 99);
}

function computeMagic(languages: Record<string, number>): number {
  // Based on language diversity
  const langCount = Object.keys(languages).length;
  const diversityScore = Math.min(langCount / 8, 1) * 50;

  // Shannon entropy for distribution evenness
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (total === 0) return 1;
  const entropy = Object.values(languages).reduce((acc, count) => {
    const p = count / total;
    return p > 0 ? acc - p * Math.log2(p) : acc;
  }, 0);
  const maxEntropy = Math.log2(langCount || 1);
  const evenness = maxEntropy > 0 ? entropy / maxEntropy : 0;
  const evennessScore = evenness * 50;

  return clamp(Math.round(diversityScore + evennessScore), 1, 99);
}

function computeSpeed(repos: GitHubRepo[], accountAgeDays: number): number {
  // Based on recent activity and update frequency
  const now = Date.now();
  const recentRepos = repos.filter(r => {
    const daysSinceUpdate = (now - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate < 90;
  });
  const recencyScore = Math.min(recentRepos.length / 10, 1) * 60;

  // Account age factor (newer active accounts get bonus)
  const ageFactor = accountAgeDays > 365 ? 1 : accountAgeDays / 365;
  const ageScore = ageFactor * 40;

  return clamp(Math.round(recencyScore + ageScore), 1, 99);
}

function computeLuck(followers: number, totalStars: number): number {
  // Community love: followers and stars
  const followerScore = Math.min(Math.log10(followers + 1) / 4, 1) * 50;
  const starScore = Math.min(Math.log10(totalStars + 1) / 4, 1) * 50;
  return clamp(Math.round(followerScore + starScore), 1, 99);
}

function computeRank(totalPower: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (totalPower >= 400) return 'S';
  if (totalPower >= 300) return 'A';
  if (totalPower >= 200) return 'B';
  if (totalPower >= 100) return 'C';
  return 'D';
}

function getTitle(rank: string, topLang: string): string {
  const titles: Record<string, string[]> = {
    S: ['传奇代码之神', '至尊架构师', '开源守护者'],
    A: ['高阶代码法师', '资深工程师', '技术先锋'],
    B: ['代码骑士', '全栈战士', '技术探索者'],
    C: ['代码学徒', '初级开发者', '编程新星'],
    D: ['代码萌新', '编程见习生', '数字冒险者'],
  };
  const rankTitles = titles[rank] || titles.D;
  const idx = Math.abs(topLang.charCodeAt(0)) % rankTitles.length;
  return rankTitles[idx];
}

export function computeLanguages(repos: GitHubRepo[]): Record<string, number> {
  const langCount: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  }
  const total = Object.values(langCount).reduce((a, b) => a + b, 0);
  if (total === 0) return {};

  const langPercent: Record<string, number> = {};
  for (const [lang, count] of Object.entries(langCount)) {
    langPercent[lang] = Math.round((count / total) * 100);
  }
  // Sort by percentage descending
  return Object.fromEntries(
    Object.entries(langPercent).sort(([, a], [, b]) => b - a)
  );
}

export function computeDevCard(
  user: GitHubUser,
  repos: GitHubRepo[],
  recentActivity: number
): DevCard {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const languages = computeLanguages(repos);
  const accountAgeDays = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
  const accountAge = Math.round(accountAgeDays / 365 * 10) / 10;

  const topLang = Object.keys(languages)[0] || 'Unknown';

  const attack = computeAttack(repos.length, recentActivity, accountAgeDays);
  const defense = computeDefense(totalStars, totalForks, repos.length);
  const magic = computeMagic(languages);
  const speed = computeSpeed(repos, accountAgeDays);
  const luck = computeLuck(user.followers, totalStars);
  const totalPower = attack + defense + magic + speed + luck;

  const rank = computeRank(totalPower);
  const title = getTitle(rank, topLang);

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    name: user.name || user.login,
    bio: user.bio || '这位开发者很神秘，什么都没留下...',
    rank,
    title,
    stats: { attack, defense, magic, speed, luck, totalPower },
    languages,
    totalStars,
    totalRepos: repos.length,
    totalForks,
    followers: user.followers,
    accountAge,
    createdAt: user.created_at,
  };
}
