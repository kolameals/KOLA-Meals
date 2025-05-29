import React, { useState, useEffect } from 'react';
import { Tabs, Typography, message } from 'antd';
import { userManagementService } from '../../../services/userManagement.service';
import UserList from './components/UserList';
import ApartmentUsers from './components/ApartmentUsers';
import NonSubscribedUsers from './components/NonSubscribedUsers';
import type { User } from '../../../types/user.types';

interface ApartmentGroup {
  apartment: string;
  tower: string;
  users: Array<{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    floor: string;
    roomNumber: string;
    hasActiveSubscription: boolean;
  }>;
  totalUsers: number;
  activeSubscribers: number;
}

interface NonSubscribedUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  addresses: Array<{
    id: string;
    apartment: string;
    tower: string;
    floor: string;
    roomNumber: string;
  }>;
  subscription: {
    status: string;
    endDate: string;
    plan: {
      name: string;
    };
  } | null;
}

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [apartmentUsers, setApartmentUsers] = useState<ApartmentGroup[]>([]);
  const [nonSubscribedUsers, setNonSubscribedUsers] = useState<NonSubscribedUser[]>([]);
  const [apartmentLoading, setApartmentLoading] = useState(true);
  const [nonSubscribedLoading, setNonSubscribedLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userManagementService.getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchApartmentUsers = async () => {
    try {
      setApartmentLoading(true);
      const data = await userManagementService.getUsersByApartment();
      setApartmentUsers(data);
    } catch (error) {
      console.error('Error fetching apartment users:', error);
      message.error('Failed to fetch apartment users');
    } finally {
      setApartmentLoading(false);
    }
  };

  const fetchNonSubscribedUsers = async () => {
    try {
      setNonSubscribedLoading(true);
      const data = await userManagementService.getNonSubscribedUsers();
      setNonSubscribedUsers(data);
    } catch (error) {
      console.error('Error fetching non-subscribed users:', error);
      message.error('Failed to fetch non-subscribed users');
    } finally {
      setNonSubscribedLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === '2') {
      fetchApartmentUsers();
    } else if (activeTab === '3') {
      fetchNonSubscribedUsers();
    }
  }, [activeTab]);

  const handleEdit = async (user: User) => {
    // Implement edit functionality
    message.info('Edit functionality to be implemented');
  };

  const handleDelete = async (userId: string) => {
    try {
      await userManagementService.deleteUser(userId);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const items = [
    {
      key: '1',
      label: 'All Users',
      children: (
        <UserList
          users={users}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
    {
      key: '2',
      label: 'By Apartment',
      children: (
        <ApartmentUsers
          apartmentUsers={apartmentUsers}
          loading={apartmentLoading}
        />
      ),
    },
    {
      key: '3',
      label: 'Non-Subscribed Users',
      children: (
        <NonSubscribedUsers
          users={nonSubscribedUsers}
          loading={nonSubscribedLoading}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <Title level={2} className="mb-6">User Management</Title>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default UsersPage; 