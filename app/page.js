'use client';

import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load users');
      }

      setUsers(data);
    } catch (error) {
      setError(error.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setUsers((currentUsers) => [...currentUsers, data]);
      setName('');
      setMessage(`Created user ${data.name}.`);
    } catch (error) {
      setError(error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Users</h1>
      <p className="mt-2 text-zinc-600">
        Create users and view the records stored in Neon.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <label className="sr-only" htmlFor="user-name">
          Name
        </label>
        <input
          id="user-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter a name"
          required
          className="min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Add user'}
        </button>
      </form>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-medium">Saved users</h2>
        <button
          type="button"
          onClick={() => void loadUsers()}
          disabled={isLoading}
          className="text-sm underline disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mt-4 text-green-700">
          {message}
        </p>
      )}
      {isLoading ? (
        <p className="mt-4 text-zinc-600">Loading users…</p>
      ) : users.length > 0 ? (
        <ul className="mt-4 divide-y divide-zinc-200 rounded-md border border-zinc-200">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span>{user.name}</span>
              <time className="text-sm text-zinc-500">
                {new Date(user.created_at).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p className="mt-4 text-zinc-600">No users yet.</p>
      )}
    </main>
  );
}
