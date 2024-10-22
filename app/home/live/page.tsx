'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Host {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Session {
  id: number;
  host: Host;
  channel_name: string;
  title: string;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
}


export default function Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const accessToken = Cookies.get('accessToken');

      try {
        const res = await fetch('/api/sessions', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to fetch sessions');
        }

        const { data } = await res.json();
        setSessions(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <p>Loading..</p>;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Classes</h1>

      {/* Available Sessions */}
      <div className="w-full max-w-md space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session.id} className="border p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold">{session.title}</h2>
              <p className="text-sm text-blue-600">channel: {session.channel_name}</p>
              <p className="text-sm text-gray-600">Host: {session.host.first_name}</p>
              <p className="text-sm">Started at: {new Date(session.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })} {new Date(session.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>              <button
                onClick={() => alert(`Joining session: ${session.channel_name}`)} // Add your logic to join the session
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Join Class
              </button>
            </div>
          ))
        ) : (
          <p>No active sessions available.</p>
        )}
      </div>
    </div>
  );
}
