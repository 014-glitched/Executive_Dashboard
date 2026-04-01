"use client";

import { useEffect, useMemo, useState } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Repo = {
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
};

type Commit = {
  commit: {
    author: {
      name: string;
      date: string;
    };
  };
};

// ─────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────

// Debounce hook
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Group commits by day
function groupCommitsByDay(commits: Commit[]) {
  const map: Record<string, number> = {};

  for (const c of commits) {
    const day = c.commit.author.date.split("T")[0];
    map[day] = (map[day] || 0) + 1;
  }

  return map;
}

// Contributor distribution
function getTopContributors(commits: Commit[]) {
  const map: Record<string, number> = {};

  for (const c of commits) {
    const name = c.commit.author.name;
    map[name] = (map[name] || 0) + 1;
  }

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function RepoInsights() {
  const [input, setInput] = useState("facebook/react");
  const debouncedRepo = useDebounce(input, 500);

  const [repo, setRepo] = useState<Repo | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ───────────────────────────────────────────
  // Fetch Data
  // ───────────────────────────────────────────
  useEffect(() => {
    if (!debouncedRepo.includes("/")) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [repoRes, commitRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${debouncedRepo}`),
          fetch(`https://api.github.com/repos/${debouncedRepo}/commits?per_page=100`),
        ]);

        if (!repoRes.ok || !commitRes.ok) {
          throw new Error("Repo not found or rate limited");
        }

        const repoData = await repoRes.json();
        const commitData = await commitRes.json();

        setRepo(repoData);
        setCommits(commitData);
      } catch (err: any) {
        setError(err.message);
        setRepo(null);
        setCommits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedRepo]);

  // ───────────────────────────────────────────
  // Derived Data (Heavy Computation)
  // ───────────────────────────────────────────
  const commitFrequency = useMemo(() => {
    return groupCommitsByDay(commits);
  }, [commits]);

  const topContributors = useMemo(() => {
    return getTopContributors(commits);
  }, [commits]);

  const avgCommitsPerDay = useMemo(() => {
    const values = Object.values(commitFrequency);
    if (!values.length) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  }, [commitFrequency]);

  // ───────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">GitHub Repo Insights</h1>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="owner/repo"
        className="w-full border px-3 py-2 rounded-md"
      />

      {/* States */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Repo Info */}
      {repo && (
        <div className="border p-4 rounded-md space-y-2">
          <h2 className="font-semibold">{repo.full_name}</h2>
          <p>⭐ Stars: {repo.stargazers_count}</p>
          <p>🍴 Forks: {repo.forks_count}</p>
          <p>🐞 Issues: {repo.open_issues_count}</p>
        </div>
      )}

      {/* Metrics */}
      {repo && (
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded-md">
            <p className="text-sm text-gray-500">Avg commits/day</p>
            <p className="text-xl font-semibold">{avgCommitsPerDay}</p>
          </div>

          <div className="border p-4 rounded-md">
            <p className="text-sm text-gray-500">Total commits</p>
            <p className="text-xl font-semibold">{commits.length}</p>
          </div>
        </div>
      )}

      {/* Contributors */}
      {topContributors.length > 0 && (
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Top Contributors</h3>
          <ul className="space-y-1">
            {topContributors.map(([name, count]) => (
              <li key={name} className="flex justify-between">
                <span>{name}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
