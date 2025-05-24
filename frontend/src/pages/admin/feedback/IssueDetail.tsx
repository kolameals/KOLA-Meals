import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Descriptions, Tag, Typography, Spin } from 'antd';
import type { AppDispatch } from '../../../store';
import type { Issue, Feedback } from '../../../services/feedback.service';
import { fetchFeedbackById } from '../../../store/slices/feedbackSlice';

const { Text } = Typography;

interface IssueDetailProps {
  issue: Issue;
}

const IssueDetail: React.FC<IssueDetailProps> = ({ issue }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const result = await dispatch(fetchFeedbackById(issue.feedbackId)).unwrap();
        setFeedback(result);
      } catch (error) {
        console.error('Failed to load feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [dispatch, issue.feedbackId]);

  return (
    <div>
      <Card title="Issue Information" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Title">{issue.title}</Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={
              issue.priority === 'HIGH' ? 'red' :
              issue.priority === 'MEDIUM' ? 'orange' :
              'blue'
            }>
              {issue.priority}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={
              issue.status === 'OPEN' ? 'red' :
              issue.status === 'IN_PROGRESS' ? 'orange' :
              issue.status === 'RESOLVED' ? 'green' :
              'default'
            }>
              {issue.status.replace('_', ' ')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Assigned To">
            {issue.user ? issue.user.name : 'Unassigned'}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {new Date(issue.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {new Date(issue.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Description" style={{ marginBottom: 16 }}>
        <Text>{issue.description}</Text>
      </Card>

      <Card title="Related Feedback">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : feedback ? (
          <>
            <Descriptions column={2}>
              <Descriptions.Item label="Title">{feedback.title}</Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={
                  feedback.type === 'MEAL_QUALITY' ? 'blue' :
                  feedback.type === 'DELIVERY' ? 'green' :
                  feedback.type === 'SERVICE' ? 'purple' :
                  'default'
                }>
                  {feedback.type.replace('_', ' ')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  feedback.status === 'OPEN' ? 'red' :
                  feedback.status === 'IN_PROGRESS' ? 'orange' :
                  feedback.status === 'RESOLVED' ? 'green' :
                  'default'
                }>
                  {feedback.status.replace('_', ' ')}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="User">{feedback.user.name}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <Text strong>Feedback Description:</Text>
              <div style={{ marginTop: 8 }}>{feedback.description}</div>
            </div>
          </>
        ) : (
          <Text type="secondary">No feedback details available</Text>
        )}
      </Card>
    </div>
  );
};

export default IssueDetail; 