import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '@clerk/clerk-react';
import api from '../api/client';
import toast from 'react-hot-toast';
import ProfileForm from '../components/forms/ProfileForm';
import Modal from '../components/common/Modal';

const Profile = () => {
  const { logout } = useAuth();
  const { user: clerkUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateProfile = async (formData) => {
    setLoading(true);
    try {
      await api.put('/user/profile', formData);
      toast.success('Profile updated successfully!');
      setIsModalOpen(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Get user from context or Clerk
  const userData = useAuth().user || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500">Manage your account settings</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          {clerkUser?.imageUrl ? (
            <img
              src={clerkUser.imageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-primary-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600">
                {clerkUser?.firstName?.charAt(0) || userData?.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {clerkUser?.firstName || userData?.name || 'User'}
            </h2>
            <p className="text-gray-500">
              {clerkUser?.emailAddresses?.[0]?.emailAddress || userData?.email || ''}
            </p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                {userData?.preferences?.currency || 'USD'}
              </span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                {userData?.preferences?.theme || 'Light'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            Edit Profile
          </button>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Account Actions</h3>
              <p className="text-sm text-gray-500">Sign out of your account</p>
            </div>
            <button
              onClick={logout}
              className="btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile"
      >
        <ProfileForm
          user={userData}
          onSuccess={handleUpdateProfile}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Profile;