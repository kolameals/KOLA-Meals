import React, { useState } from 'react';
import { Card, Table, Tag, Spin, Alert, Select, Statistic, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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

interface ApartmentUsersProps {
  apartmentUsers: ApartmentGroup[];
  loading: boolean;
}

const ApartmentUsers: React.FC<ApartmentUsersProps> = ({ apartmentUsers, loading }) => {
  const [selectedApartment, setSelectedApartment] = useState<string>('all');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!apartmentUsers.length) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Alert message="No apartment users found" type="info" />
      </div>
    );
  }

  // Get unique apartments for the selector
  const uniqueApartments = Array.from(new Set(apartmentUsers.map(group => group.apartment))).sort();
  
  // Filter apartment groups based on selection
  const filteredGroups = selectedApartment === 'all' 
    ? apartmentUsers 
    : apartmentUsers.filter(group => group.apartment === selectedApartment);

  // Calculate total statistics
  const totalStats = filteredGroups.reduce((acc, group) => ({
    totalUsers: acc.totalUsers + group.totalUsers,
    activeSubscribers: acc.activeSubscribers + group.activeSubscribers,
    totalTowers: acc.totalTowers + 1
  }), { totalUsers: 0, activeSubscribers: 0, totalTowers: 0 });

  // Sort apartment groups by apartment name and tower
  const sortedApartmentGroups = [...filteredGroups].sort((a, b) => {
    const apartmentCompare = a.apartment.localeCompare(b.apartment);
    if (apartmentCompare !== 0) return apartmentCompare;
    return a.tower.localeCompare(b.tower);
  });

  const columns: ColumnsType<ApartmentGroup['users'][0]> = [
    {
      title: 'Floor',
      dataIndex: 'floor',
      key: 'floor',
      sorter: (a, b) => {
        const floorA = parseInt(a.floor) || 0;
        const floorB = parseInt(b.floor) || 0;
        return floorA - floorB;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Room',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      sorter: (a, b) => {
        const roomA = parseInt(a.roomNumber) || 0;
        const roomB = parseInt(b.roomNumber) || 0;
        return roomA - roomB;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.hasActiveSubscription ? 'success' : 'default'}>
          {record.hasActiveSubscription ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Apartment Selector and Statistics */}
      <Card className="shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full md:w-64">
            <Select
              className="w-full"
              value={selectedApartment}
              onChange={setSelectedApartment}
              options={[
                { value: 'all', label: 'All Apartments' },
                ...uniqueApartments.map(apt => ({ value: apt, label: apt }))
              ]}
            />
          </div>
          <div className="w-full md:w-auto bg-gray-50 p-6 rounded-lg">
            <Row gutter={[32, 16]} className="w-full">
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-[100px] flex flex-col">
                  <div className="h-6 mb-6">
                    <span className="text-gray-600 font-medium">Total Customers</span>
                  </div>
                  <div className="h-8">
                    <Statistic
                      value={totalStats.totalUsers}
                      valueStyle={{ 
                        color: '#1890ff', 
                        fontSize: '28px',
                        fontWeight: 'bold',
                        lineHeight: '1'
                      }}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-[100px] flex flex-col">
                  <div className="h-6 mb-6">
                    <span className="text-gray-600 font-medium">Active Subscribers</span>
                  </div>
                  <div className="h-8">
                    <Statistic
                      value={totalStats.activeSubscribers}
                      valueStyle={{ 
                        color: '#52c41a', 
                        fontSize: '28px',
                        fontWeight: 'bold',
                        lineHeight: '1'
                      }}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-[100px] flex flex-col">
                  <div className="h-6 mb-6">
                    <span className="text-gray-600 font-medium">Total Towers</span>
                  </div>
                  <div className="h-8">
                    <Statistic
                      value={totalStats.totalTowers}
                      valueStyle={{ 
                        color: '#722ed1', 
                        fontSize: '28px',
                        fontWeight: 'bold',
                        lineHeight: '1'
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      {/* Apartment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedApartmentGroups.map((group) => (
          <Card
            key={`${group.apartment}-${group.tower}`}
            title={
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  {group.apartment} - Tower {group.tower}
                </span>
                <div className="space-x-2">
                  <Tag color="success">{group.activeSubscribers} Active</Tag>
                  <Tag color="blue">{group.totalUsers} Total</Tag>
                </div>
              </div>
            }
            className="shadow-md"
          >
            <Table
              dataSource={group.users}
              rowKey="id"
              size="small"
              pagination={false}
              columns={columns}
              sortDirections={['ascend', 'descend']}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApartmentUsers; 