import { getSupabase } from './supabase';
import { LeaderboardEntry } from './types';

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_power', { ascending: false });

  if (error || !data) return [];

  return data.map(row => ({
    username: row.username,
    avatarUrl: row.avatar_url,
    name: row.name,
    rank: row.rank,
    totalPower: row.total_power,
    stats: {
      attack: row.attack,
      defense: row.defense,
      magic: row.magic,
      speed: row.speed,
      luck: row.luck,
      totalPower: row.total_power,
    },
    updatedAt: row.updated_at,
  }));
}

export async function upsertLeaderboard(entry: LeaderboardEntry): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase.from('leaderboard').upsert(
    {
      username: entry.username,
      avatar_url: entry.avatarUrl,
      name: entry.name,
      rank: entry.rank,
      total_power: entry.totalPower,
      attack: entry.stats.attack,
      defense: entry.stats.defense,
      magic: entry.stats.magic,
      speed: entry.stats.speed,
      luck: entry.stats.luck,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'username' }
  );
}
