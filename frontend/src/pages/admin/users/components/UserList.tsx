import React from 'react';
import { Table, Badge, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '../../../../types/user.types';
import { formatDate } from '../../../../utils/date';

interface Address {
  id: string;
  apartment: string;
  tower: string;
  floor: string;
  roomNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface UserListProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, loading, onEdit, onDelete }) => {
  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="text-gray-500 text-sm">{record.email || record.phoneNumber}</div>
        </div>
      ),
    },
    {
      title: 'Apartment Details',
      dataIndex: 'addresses',
      key: 'addresses',
      render: (addresses: Address[] | undefined) => {
        const defaultAddress = addresses?.find((addr: Address) => addr.isDefault);
        return defaultAddress ? (
          <div>
            <div className="font-medium">{defaultAddress.apartment}</div>
            <div className="text-sm">
              Tower {defaultAddress.tower}, Floor {defaultAddress.floor}, Room {defaultAddress.roomNumber}
            </div>
          </div>
        ) : '-';
      },
    },
    {
      title: 'Subscription',
      dataIndex: 'subscription',
      key: 'subscription',
      render: (subscription) => subscription ? (
        <div>
          <div className="flex items-center gap-2">
            <Badge 
              status={
                subscription.status === 'ACTIVE' ? 'success' : 
                subscription.status === 'CANCELLED' ? 'error' : 
                subscription.status === 'PAUSED' ? 'warning' : 'default'
              } 
              text={subscription.plan?.name || 'Unknown Plan'}
            />
          </div>
          <div className="text-sm text-gray-500">
            {subscription.plan?.mealsPerDay} meals/day • ₹{subscription.plan?.price}/month
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
          </div>
        </div>
      ) : (
        <Badge status="default" text="No Subscription" />
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Badge 
          status={role === 'ADMIN' ? 'error' : role === 'DELIVERY_PARTNER' ? 'warning' : 'processing'} 
          text={role.replace('_', ' ')}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Edit User">
            <Button type="link" onClick={() => onEdit(record)}>
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete User">
            <Button type="link" danger onClick={() => onDelete(record.id)}>
              Delete
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey="id"
      pagination={false}
    />
  );
};

export default UserList; 