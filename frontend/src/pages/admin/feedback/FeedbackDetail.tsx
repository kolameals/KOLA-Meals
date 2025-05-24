import React from 'react';
import { Card, Descriptions, Tag, Timeline, Typography } from 'antd';
import type { Feedback } from '../../../services/feedback.service';

const { Text } = Typography;

interface FeedbackDetailProps {
  feedback: Feedback;
}

const FeedbackDetail: React.FC<FeedbackDetailProps> = ({ feedback }) => {
  return (
    <div>
      <Card title="Feedback Information" style={{ marginBottom: 16 }}>
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
          <Descriptions.Item label="Rating">
            {feedback.rating ? `${feedback.rating}/5` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="User">{feedback.user.name}</Descriptions.Item>
          <Descriptions.Item label="Date">
            {new Date(feedback.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Description" style={{ marginBottom: 16 }}>
        <Text>{feedback.description}</Text>
      </Card>

      <Card title="Responses">
        <Timeline>
          {feedback.responses.map((response) => (
            <Timeline.Item key={response.id}>
              <div>
                <Text strong>{response.user.name}</Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  {new Date(response.createdAt).toLocaleString()}
                </Text>
                <div style={{ marginTop: 8 }}>{response.message}</div>
              </div>
            </Timeline.Item>
          ))}
          {feedback.responses.length === 0 && (
            <Timeline.Item>
              <Text type="secondary">No responses yet</Text>
            </Timeline.Item>
          )}
        </Timeline>
      </Card>

      {feedback.issues && feedback.issues.length > 0 && (
        <Card title="Related Issues" style={{ marginTop: 16 }}>
          {feedback.issues.map((issue) => (
            <Card
              key={issue.id}
              type="inner"
              title={issue.title}
              style={{ marginBottom: 8 }}
            >
              <Descriptions column={2}>
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
              </Descriptions>
              <div style={{ marginTop: 8 }}>{issue.description}</div>
            </Card>
          ))}
        </Card>
      )}
    </div>
  );
};

export default FeedbackDetail; 