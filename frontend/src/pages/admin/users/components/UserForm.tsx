import React, { useState, useEffect } from 'react';
import type { User, CreateUserData, UpdateUserData } from '../../../../types/user.types';
import { UserRole } from '../../../../types/user.types';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<CreateUserData | UpdateUserData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserRole.CUSTOMER
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        password: '',
        role: user.role || UserRole.CUSTOMER
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: UserRole.CUSTOMER
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      alert('Name is required');
      return;
    }

    if (!user && !formData.password) {
      alert('Password is required for new users');
      return;
    }

    if (user) {
      // For update, we don't need to send password if it's empty
      const updateData: UpdateUserData = {
        name: formData.name,
        email: formData.email || '',
        phoneNumber: formData.phoneNumber || '',
        role: formData.role
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      onSubmit(updateData);
    } else {
      // For create, we need all required fields
      const createData: CreateUserData = {
        name: formData.name,
        email: formData.email || '',
        phoneNumber: formData.phoneNumber || '',
        password: formData.password,
        role: formData.role
      };
      onSubmit(createData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900">
            {user ? 'Edit User' : 'Create New User'}
          </h3>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {!user && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {user ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm; 