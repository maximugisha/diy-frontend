'use client';

import Image from 'next/image';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie to retrieve the token
import Link from 'next/link';

// Define the Profile interface
interface Profile {
    id: number;
    profile_picture: string;
    biography: string;
    phone_number: number;
    date_of_birth: string;
    interests: string[]; // Array of interests
    first_name: string;
    username: string;
    last_name: string;
    organization: string;
    email: string;
    role: string;
}

export default function Page() {
    const [profile, setProfile] = useState<Profile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

    useEffect(() => {
        const fetchProfile = async () => {
            const accessToken = Cookies.get('accessToken'); // Retrieve the access token

            try {
                const res = await fetch('/api/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`, // Include the token in the headers
                    },
                });

                if (!res.ok) {
                    const { error } = await res.json();
                    throw new Error(error || 'Failed to fetch profile');
                }

                const { data } = await res.json();
                setProfile(data);
            } catch (error: any) {
                setError(error.message); // Capture and set error message
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    const userprofile = profile[0];

    return (
        <div className="relative max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Edit button in the top-right corner */}
      <Link href={`/home/profile/${userprofile.id}`}>
        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
          <PencilSquareIcon className="w-6 h-6 text-gray-500" />Edit
        </button>
      </Link>

      <div className="flex items-center space-x-6">
        <img
          src={`${baseUrl}${userprofile?.profile_picture}`}
          alt="Profile Picture"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {userprofile?.first_name} {userprofile?.last_name}
          </h1>
          <p className="text-sm text-gray-600">@{userprofile?.username}</p>
          <p className="mt-2 text-lg font-semibold text-gray-500">{userprofile?.role}</p>
          <p className="text-sm text-gray-500">{userprofile?.organization}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Biography</h2>
        <p className="mt-2 text-gray-600">{userprofile?.biography}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-gray-800">Email:</h3>
          <p className="text-gray-600">{userprofile?.email}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Phone Number:</h3>
          <p className="text-gray-600">{userprofile?.phone_number}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Date of Birth:</h3>
          <p className="text-gray-600">{userprofile?.date_of_birth}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Interests:</h3>
          <p className="text-gray-600">{userprofile?.interests?.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}