'use client';
import { CogIcon, KeyIcon, HeartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie to retrieve the token

// Define the Post interface
interface Post {
  id: number;
  title: string;
  content: string;
  likes: number;
  created_since: string;
  images: string[]; // Array of image URLs
  user: {
    username: string;
    profile_picture: string;
    organization: string;
  };
}

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = Cookies.get('accessToken'); // Retrieve the access token

      try {
        const res = await fetch('/api/posts', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // Include the token in the headers
          },
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to fetch posts');
        }

        const { data } = await res.json();
        setPosts(data);
      } catch (error: any) {
        setError(error.message); // Capture and set error message
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  console.log(posts)
  const openModal = (image: string) => {
    setSelectedImage(image); // Set the clicked image as the selected one
  };

  const closeModal = () => {
    setSelectedImage(null); // Close modal by setting selected image to null
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border-b border-gray-300 py-6">
            <div className="flex space-x-4">
              <Image
                src={baseUrl + post.user.profile_picture}
                alt={"profile-pic"}
                width={50}
                height={50}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-sm font-semibold">{post.user.username}</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                    </svg>
                    <p className="text-xs text-gray-500">@{post.user.organization}</p>
                  </div>
                  <span className="text-xs text-gray-500">{post.created_since}</span>
                </div>

                <p className="mt-2 text-sm">{post.content}</p>

                {post.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {post.images.map((image, index) => (
                      <Image
                        key={index}
                        src={baseUrl + image}
                        alt={`Image ${index + 1} for post ${post.id}`}
                        width={200}
                        height={200}
                        className="cursor-pointer rounded-lg"
                        onClick={() => openModal(baseUrl + image)} // Click event to open modal
                      />
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-4 text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-blue-500">
                    <CogIcon className="w-5 h-5" />
                    <span className="text-xs">Comment</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-green-500">
                    <KeyIcon className="w-5 h-5" />
                    <span className="text-xs">Share</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-red-500">
                    <HeartIcon className="w-5 h-5" />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for displaying the selected image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Selected Image"
              width={500}
              height={500}
              className="rounded-lg"
            />
            <button
              className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2"
              onClick={closeModal} // Close modal button
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
