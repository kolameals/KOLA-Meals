import React from 'react';
import { Card, Table, Button, Spin, Alert, Typography } from 'antd';

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

interface NonSubscribedUsersProps {
  users: NonSubscribedUser[];
  loading: boolean;
}

const NonSubscribedUsers: React.FC<NonSubscribedUsersProps> = ({ users, loading }) => {
  const handleContactUser = (user: NonSubscribedUser) => {
    // Implement contact functionality (e.g., open email client or show contact modal)
    console.log('Contact user:', user);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Alert message="No non-subscribed users found" type="info" />
      </div>
    );
  }

  return (
    <Card
      title={
        <Typography.Title level={5} className="m-0">
          Non-Subscribed Users ({users.length})
        </Typography.Title>
      }
      className="shadow-md"
    >
      <Table
        dataSource={users}
        rowKey="id"
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Contact',
            key: 'contact',
            render: (_, record) => (
              <div className="space-y-1">
                <div className="text-sm">{record.email}</div>
                <div className="text-sm">{record.phoneNumber}</div>
              </div>
            ),
          },
          {
            title: 'Address',
            key: 'address',
            render: (_, record) => (
              <div className="space-y-1">
                {record.addresses.map((address) => (
                  <div key={address.id} className="text-sm">
                    {address.apartment} - Tower {address.tower}, Floor {address.floor}, Room {address.roomNumber}
                  </div>
                ))}
              </div>
            ),
          },
          {
            title: 'Last Subscription',
            key: 'subscription',
            render: (_, record) => (
              <div className="space-y-1">
                {record.subscription ? (
                  <>
                    <div className="text-sm">Plan: {record.subscription.plan.name}</div>
                    <div className="text-sm text-gray-500">
                      Ended: {new Date(record.subscription.endDate).toLocaleDateString()}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">Never subscribed</div>
                )}
              </div>
            ),
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <Button
                type="primary"
                size="small"
                onClick={() => handleContactUser(record)}
              >
                Contact
              </Button>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default NonSubscribedUsers; 