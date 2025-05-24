import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Card, Select, Input, Space, Button, message } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { AppDispatch, RootState } from '../../../store';
import { fetchFeedbacks } from '../../../store/slices/feedbackSlice';
import FeedbackList from './FeedbackList';
import IssueList from './IssueList';

const { TabPane } = Tabs;
const { Option } = Select;

const FeedbackManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { feedbacks, loading } = useSelector((state: RootState) => state.feedback);
  const [activeTab, setActiveTab] = useState('1');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    dispatch(fetchFeedbacks(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Extract all issues from feedbacks
  const allIssues = feedbacks.reduce((issues, feedback) => {
    return [...issues, ...feedback.issues];
  }, [] as any[]);

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search feedbacks..."
              prefix={<SearchOutlined />}
              onChange={e => handleSearch(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Filter by type"
              style={{ width: 150 }}
              onChange={value => handleFilterChange('type', value)}
              allowClear
            >
              <Option value="MEAL_QUALITY">Meal Quality</Option>
              <Option value="DELIVERY">Delivery</Option>
              <Option value="SERVICE">Service</Option>
              <Option value="OTHER">Other</Option>
            </Select>
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              onChange={value => handleFilterChange('status', value)}
              allowClear
            >
              <Option value="OPEN">Open</Option>
              <Option value="IN_PROGRESS">In Progress</Option>
              <Option value="RESOLVED">Resolved</Option>
              <Option value="CLOSED">Closed</Option>
            </Select>
          </Space>

          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Feedbacks" key="1">
              <FeedbackList feedbacks={feedbacks} loading={loading} />
            </TabPane>
            <TabPane tab="Issues" key="2">
              <IssueList issues={allIssues} loading={loading} />
            </TabPane>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default FeedbackManagement; 