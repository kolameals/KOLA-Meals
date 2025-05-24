import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Table, Tag, Button, Modal, Form, Select, message, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { AppDispatch } from '../../../store';
import type { Issue } from '../../../services/feedback.service';
import { updateIssueStatus, assignIssue } from '../../../store/slices/feedbackSlice';
import IssueDetail from './IssueDetail';

const { Option } = Select;

interface IssueListProps {
  issues: Issue[];
  loading: boolean;
}

const IssueList: React.FC<IssueListProps> = ({ issues, loading }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const handleViewDetail = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDetailModalVisible(true);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await dispatch(updateIssueStatus({ id, data: { status } }));
      message.success('Status updated successfully');
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const handleAssignIssue = async (id: string, userId: string) => {
    try {
      await dispatch(assignIssue({ id, data: { userId } }));
      message.success('Issue assigned successfully');
    } catch (error) {
      message.error('Failed to assign issue');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={
          priority === 'HIGH' ? 'red' :
          priority === 'MEDIUM' ? 'orange' :
          'blue'
        }>
          {priority}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(selectedIssue?.id || '', value)}
        >
          <Option value="OPEN">Open</Option>
          <Option value="IN_PROGRESS">In Progress</Option>
          <Option value="RESOLVED">Resolved</Option>
          <Option value="CLOSED">Closed</Option>
        </Select>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: ['assignedTo', 'name'],
      key: 'assignedTo',
      render: (name: string | undefined, record: Issue) => (
        <Select
          value={name}
          style={{ width: 150 }}
          onChange={(value) => handleAssignIssue(record.id, value)}
          placeholder="Assign to..."
        >
          <Option value="user1">John Doe</Option>
          <Option value="user2">Jane Smith</Option>
          <Option value="user3">Mike Johnson</Option>
        </Select>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Issue) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={issues}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Issue Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedIssue && (
          <IssueDetail issue={selectedIssue} />
        )}
      </Modal>
    </>
  );
};

export default IssueList; 