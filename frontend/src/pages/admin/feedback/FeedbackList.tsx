import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import type { Feedback } from '../../../types/feedback.types';

interface FeedbackListProps {
  feedbacks: Feedback[];
  loading: boolean;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks, loading }) => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color="green">{status}</Tag>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => rating || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Feedback) => (
        <Space>
          <Button type="link">View</Button>
          <Button type="link">Respond</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={feedbacks}
      loading={loading}
      rowKey="id"
    />
  );
};

export default FeedbackList; 