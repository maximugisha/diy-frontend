'use client';
import { useState, useEffect } from 'react';
import { ArrowDownCircleIcon, EyeIcon, ServerIcon, PlusIcon } from '@heroicons/react/24/outline';
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
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal state
  const [newResource, setNewResource] = useState({
    title: '',
    content: '',
    type: '',
    attachment: null as File | null,  // For handling file upload
  });
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

  // Modal handling
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Form input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewResource({
      ...newResource,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewResource({
        ...newResource,
        attachment: e.target.files[0],
      });
    }
  };

  // Form submission for creating a new resource
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');
    
    const formData = new FormData();
    formData.append('title', newResource.title);
    formData.append('content', newResource.content);
    formData.append('type', newResource.type);
    if (newResource.attachment) {
      formData.append('attachment', newResource.attachment);
    }

    try {
      const res = await fetch(`${baseUrl}/api/posts/resources/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });
      const data = await res.json();
      setResources([...resources, data]); // Add new resource to the list
      closeModal(); // Close the modal after submission
    } catch (error) {
      console.error('Failed to create resource:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Create Resource Button */}
      <div className="mb-4 flex items-center space-x-4">
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          onClick={openModal}
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Create Resource
        </button>
      </div>

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
            <th className="p-3">Title</th>
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
              <td className="p-3 text-center">
                <div className="flex justify-center space-x-4">
                  <a href={resource.attachment} download>
                    <ArrowDownCircleIcon className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                  </a>
                  <a href={`/home/resources/${resource.id}`}>
                    <EyeIcon className="w-5 h-5 text-green-500 hover:text-green-700" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Creating Resource */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create New Resource</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newResource.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Content</label>
                <textarea
                  name="content"
                  value={newResource.content}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Type</label>
                <input
                  type="text"
                  name="type"
                  value={newResource.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Attachment</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
