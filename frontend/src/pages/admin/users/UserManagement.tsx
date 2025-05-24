import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../../store/slices/userManagementSlice';
import type { User, CreateUserData, UpdateUserData } from '../../../types/user.types';
import type { RootState } from '../../../store';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users = [], loading, error, total, page, totalPages } = useAppSelector(
    (state: RootState) => state.userManagement || {
      users: [],
      loading: false,
      error: null,
      total: 0,
      page: 1,
      totalPages: 1
    }
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      setIsFormOpen(false);
      dispatch(fetchUsers({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      await dispatch(updateUser({ userId, userData })).unwrap();
      setSelectedUser(null);
      dispatch(fetchUsers({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        dispatch(fetchUsers({ page: currentPage, limit: 10 }));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleFormSubmit = (data: CreateUserData | UpdateUserData) => {
    if (selectedUser) {
      handleUpdateUser(selectedUser.id, data as UpdateUserData);
    } else {
      handleCreateUser(data as CreateUserData);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  // Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New User
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <UserList
          users={safeUsers}
          onEdit={setSelectedUser}
          onDelete={handleDeleteUser}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {(isFormOpen || selectedUser) && (
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default UserManagement; 