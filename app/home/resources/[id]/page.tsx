'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';

interface Resource {
  id: number;
  title: string;
  content: string;
  type: string;
  attachment: string;
  attachment_name: string;
  user: {
    username: string;
    profile_picture: string;
    organization: string;
    role: string;
  };
}

export default function ResourceView() {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get the resource ID from the URL
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  useEffect(() => {
    if (id) {
      const fetchResource = async () => {
        const accessToken = Cookies.get('accessToken');
        try {
          const res = await fetch(`${baseUrl}/api/posts/resources/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();
          setResource(data);
        } catch (error) {
          console.error('Failed to fetch resource:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchResource();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!resource) return <p>Resource not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 mb-4"
        onClick={() => router.back()} // Go back to the previous page
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-wrap items-center mb-4">
          <h2 className="text-2xl font-bold mr-4">{resource.title}</h2>
          <span className="text-sm text-gray-600 mr-2">&bull;</span>
          <p className="text-sm text-gray-600">{resource.type}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Summary:</h3>
          <p>{resource.content}</p>
        </div>

        {resource.attachment && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Attachment(s):</h3>
            <a href={resource.attachment} download={resource.attachment_name} className="flex items-center text-blue-500 hover:text-blue-700">
              <ArrowDownCircleIcon className="w-5 h-5 mr-2" />
              Download {resource.attachment_name}
            </a>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Posted By:</h3>
          <div className="flex items-center space-x-4">
            <img
              src={baseUrl + resource.user.profile_picture}
              alt="profile"
              width={40}
              height={40}
              className="rounded object-cover"
            />
            <div>
              <p className="text-sm font-medium">{resource.user.username} · {resource.user.role}</p>
              <p className="text-xs text-gray-500">@{resource.user.organization}</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
