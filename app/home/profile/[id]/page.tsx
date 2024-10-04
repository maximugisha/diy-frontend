'use client';

import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';

// Define the Profile interface
interface Profile {
  id: number;
  profile_picture: string;
  biography: string;
  phone_number: string;
  date_of_birth: string;
  interests: number[]; // Store IDs for interests
  first_name: string;
  username: string;
  last_name: string;
  organization: number; // Store ID for organization
  email: string;
  role: number; // Store ID for role
}

interface Organization {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

interface Interest {
  id: number;
  name: string;
}

export default function EditProfile() {
  const router = useRouter();
  const { id } = useParams(); // Get the user ID from the URL
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Profile | null>(null); // Initialize as null
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = Cookies.get('accessToken');

      try {
        const res = await fetch(`${baseUrl}/api/account/user-profile/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to fetch profile');
        }

        const result = await res.json();
        const { data } = result; // Adjust this if needed

        setProfile(data);
        setFormData(data); // Set formData to the fetched profile data
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrganizations = async () => {
      const accessToken = Cookies.get('accessToken');

      try {
        const res = await fetch(`${baseUrl}/api/account/organizations/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to fetch organizations');
        }

        const data = await res.json();
        setOrganizations(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    const fetchRoles = async () => {
      const accessToken = Cookies.get('accessToken');

      try {
        const res = await fetch(`${baseUrl}/api/account/roles`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to fetch roles');
        }

        const data = await res.json();
        setRoles(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    const fetchInterests = async () => {
      const accessToken = Cookies.get('accessToken');

      try {
        const res = await fetch(`${baseUrl}/api/account/interests`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to fetch interests');
        }

        const data = await res.json();
        setInterests(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (id) {
      fetchProfile();
      fetchOrganizations();
      fetchRoles();
      fetchInterests();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...(prevData as Profile), // Assert that prevData is of type Profile
      [name]: value,
    }));
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInterests = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
    setFormData((prevData) => ({
      ...(prevData as Profile),
      interests: selectedInterests, // Ensure it's an array of integers
    }));
  };

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...(prevData as Profile), // Assert that prevData is of type Profile
      organization: parseInt(e.target.value, 10),
    }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevData) => ({
      ...(prevData as Profile), // Assert that prevData is of type Profile
      role: parseInt(e.target.value, 10),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');
    const updatedData = Object.fromEntries(Object.entries(formData || {}).filter(([_, v]) => v !== null && v !== undefined));

    try {
      const res = await fetch(`${baseUrl}/api/account/user-profile/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to update profile');
      }

      router.push('/home/profile/'); // Redirect to the profile view after successful update
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-800">Biography</label>
            <textarea
              name="biography"
              value={formData?.biography || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-800">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData?.phone_number || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-800">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData?.date_of_birth || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-800">Interests</label>
            <select
              multiple
              name="interests"
              value={formData?.interests?.map(String) || []} // Ensure interests is an array
              onChange={handleInterestsChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              {interests.map((interest) => (
                <option key={interest.id} value={interest.id}>
                  {interest.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-800">Organization</label>
            <select
              name="organization"
              value={formData?.organization || ''}
              onChange={handleOrganizationChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>Select Organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-800">Role</label>
            <select
              name="role"
              value={formData?.role || ''}
              onChange={handleRoleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>Select Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
