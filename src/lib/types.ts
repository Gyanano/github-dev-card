export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  public_gists: number;
}

export interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  size: number;
  updated_at: string;
  fork: boolean;
}

export interface DevStats {
  attack: number;      // Commit frequency & contribution intensity
  defense: number;     // Code quality: stars, forks ratio
  magic: number;       // Language diversity
  speed: number;       // Activity recency & consistency
  luck: number;        // Stars & followers (community love)
  totalPower: number;
}

export interface DevCard {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  stats: DevStats;
  languages: Record<string, number>; // language -> percentage
  totalStars: number;
  totalRepos: number;
  totalForks: number;
  followers: number;
  accountAge: number; // in years
  createdAt: string;
}

export interface LeaderboardEntry {
  username: string;
  avatarUrl: string;
  name: string;
  rank: string;
  totalPower: number;
  stats: DevStats;
  updatedAt: string;
}

export interface BattleResult {
  winner: string;
  loser: string;
  details: {
    stat: string;
    player1: number;
    player2: number;
    winner: 1 | 2 | 0;
  }[];
  player1Score: number;
  player2Score: number;
}
