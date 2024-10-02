'use client';
import Cookies from 'js-cookie';

import { useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string || 'https://maxicodes.com:8000';
    const endpoint = '/api/token/';
    const url = `${baseUrl}${endpoint}`;
    e.preventDefault();
    setError(''); // Reset the error message
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // or "email" depending on your backend field
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { access } = data;

      // Store the access token in cookies (or localStorage if preferred)
      // document.cookie = `accessToken=${access}; path=/`;

      // Store the access token in cookies (instead of localStorage)
      Cookies.set('accessToken', access, {
        expires: 1, // Token will expire in 1 day (adjust as needed)
        secure: false, // Ensure the cookie is only sent over HTTPS
        sameSite: 'lax', // Cookie will only be sent in a first-party context
        path: '/', // Available throughout the website
      });

      // Redirect to another page after successful login
      router.push('/home'); // Replace with your redirect path
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleLogin}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        {error && <p className="text-red-600">{error}</p>}
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="username"
                type="text"
                name="username"
                placeholder="Enter your Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full">
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </div>
    </form>
  );
}
