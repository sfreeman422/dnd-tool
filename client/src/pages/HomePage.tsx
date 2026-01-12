import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCampaigns, createCampaign, deleteCampaign } from '../services/campaignApi';

export default function HomePage() {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns
  });

  const createMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setShowCreate(false);
      setNewName('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      createMutation.mutate({ name: newName.trim() });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">D&D Campaign Manager</h1>
        <div className="flex gap-4">
          <Link
            to="/admin"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Admin Panel
          </Link>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          >
            New Campaign
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Campaign name"
                className="w-full px-4 py-2 bg-gray-700 rounded mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition"
          >
            <h2 className="text-xl font-bold mb-2">{campaign.name}</h2>
            <p className="text-gray-400 mb-4 text-sm">
              {campaign.description || 'No description'}
            </p>
            <div className="flex gap-2">
              <Link
                to={`/campaign/${campaign.id}`}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-center"
              >
                Play
              </Link>
              <Link
                to={`/admin/${campaign.id}`}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  if (confirm('Delete this campaign?')) {
                    deleteMutation.mutate(campaign.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {campaigns?.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">
            No campaigns yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
