'use client';
import { CogIcon, KeyIcon, HeartIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = Cookies.get('accessToken');

      try {
        const res = await fetch('/api/posts', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to fetch posts');
        }

        const { data } = await res.json();
        setPosts(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading..</p>;

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  // Handle content input change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Handle image selection for multiple images
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
  };

  // Upload images to the server and get the single UUID returned
  const uploadImages = async (): Promise<string | null> => {
    const accessToken = Cookies.get('accessToken');
    const formData = new FormData();

    imageFiles.forEach((file) => formData.append('images', file)); // Append all files to the form

    const response = await fetch(`${baseUrl}/api/common/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      return data.id; // Single UUID returned
    } else {
      console.error('Error uploading images:', data);
      return null;
    }
  };

  // Handle post submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content && imageFiles.length === 0) {
      alert('Please enter some content or upload at least one image.');
      return;
    }

    setLoading(true);
    try {
      // Upload the images and get the single UUID returned
      const uploadedImageId = await uploadImages();

      if (!uploadedImageId) {
        throw new Error('Image upload failed');
      }

      // Prepare the payload
      const payload = {
        content,
        images: uploadedImageId, // Single UUID for the group of uploaded images
      };

      const accessToken = Cookies.get('accessToken');
      const response = await fetch(`${baseUrl}/api/posts/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        const newPost = {
          id: data.id,
          title: data.title,
          content: data.content,
          likes: 0, // You can start with 0 likes for a new post
          created_since: 'Just now', // You can handle this as you like
          images: data.images || [], // Array of image URLs
          user: {
            username: data.user.username,
            profile_picture: data.user.profile_picture,
            organization: data.user.organization,
          },
        };
        setPosts([newPost, ...posts]); // Append new post on top of the posts list
        setContent(''); // Clear content
        setImageFiles([]); // Clear image selection
      } else {
        console.error('Error creating post:', data);
      }
    } catch (error) {
      console.error('Post creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Create Post Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <textarea
            className="flex-grow p-2 border border-gray-300 rounded-lg"
            placeholder="What's on your mind?"
            value={content}
            onChange={handleContentChange}
          />

          <label className="flex items-center cursor-pointer space-x-2">
            <PhotoIcon className="w-6 h-6 text-gray-600" />
            <span className="text-sm text-gray-600"></span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelection}
            />
          </label>

          {imageFiles.length > 0 && (
            <p className="text-sm text-gray-500">{imageFiles.length} image(s) selected</p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border-b border-gray-300 py-6">
            <div className="flex space-x-4">
              <img
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
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"> {/* Adjusted gap to a smaller value */}
                    {post.images.map((image, index) => (
                      <div className="relative w-full aspect-w-1 aspect-h-1 overflow-hidden" key={index}> {/* Container for each image */}
                        <img
                          src={baseUrl + image}
                          alt={`Image ${index + 1} for post ${post.id}`}
                          className="w-full h-full object-cover cursor-pointer rounded-lg"
                          onClick={() => openModal(baseUrl + image)}
                        />
                      </div>
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
            <img
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
