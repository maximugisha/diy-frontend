'use client';
import { useState, useEffect } from 'react';
import { ArrowDownCircleIcon, EyeIcon, ServerIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Cookies from 'js-cookie';

interface Resource {
  id: number;
  title: string;
  content: string;
  type: string;
  attachment_size: number;
  attachment: string;
  attachment_name: string;
  user: {
    username: string;
    profile_picture: string;
    organization: string;
    role: string;
  };
}

export default function ResourceTable() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  useEffect(() => {
    const fetchResources = async () => {
      const accessToken = Cookies.get('accessToken');
      try {
        const res = await fetch(`${baseUrl}/api/posts/resources`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Bar */}
      <div className="mb-4 flex items-center space-x-4">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ServerIcon className="w-5 h-5 absolute top-2.5 right-3 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="text-left text-gray-700 border-b">
            <th className="p-3 cursor-pointer flex items-center">
              Title
              <ServerIcon className="w-4 h-4 ml-1 text-gray-500" />
            </th>
            <th className="p-3">Type</th>
            <th className="p-3">Attachment Size</th>
            <th className="p-3">User</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredResources.map((resource) => (
            <tr key={resource.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{resource.title}</td>
              <td className="p-3">{resource.type}</td>
              <td className="p-3">{resource.attachment_size} B</td>
              <td className="p-3 flex items-center space-x-2">
                <img
                  src={baseUrl + resource.user.profile_picture}
                  alt="profile"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{resource.user.username} · {resource.user.role}</p>
                  <p className="text-xs text-gray-500">@{resource.user.organization}</p>
                </div>
              </td>
              {/* Actions column - Correct Placement */}
              <td className="p-3 text-center">
                <div className="flex justify-center space-x-4">
                  <a href={resource.attachment} download>
                    <ServerIcon className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                  </a>
                  <a href={`/resources/${resource.id}`}>
                    <EyeIcon className="w-5 h-5 text-green-500 hover:text-green-700" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}