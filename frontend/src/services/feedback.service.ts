import api from './api';

export interface Feedback {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  rating?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  responses: FeedbackResponse[];
  issues: Issue[];
}

export interface FeedbackResponse {
  id: string;
  feedbackId: string;
  userId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Issue {
  id: string;
  feedbackId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateFeedbackDto {
  type: string;
  title: string;
  description: string;
  rating?: number;
}

export interface CreateResponseDto {
  message: string;
}

export interface CreateIssueDto {
  title: string;
  description: string;
  priority: string;
  assignedTo?: string;
}

export interface UpdateStatusDto {
  status: string;
}

export interface AssignIssueDto {
  userId: string;
}

export const feedbackService = {
  async getFeedbacks(filters?: {
    type?: string;
    status?: string;
    userId?: string;
  }): Promise<Feedback[]> {
    const response = await api.get('/feedback', { params: filters });
    return response.data;
  },

  async getFeedbackById(id: string): Promise<Feedback> {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
  },

  async createFeedback(data: CreateFeedbackDto): Promise<Feedback> {
    const response = await api.post('/feedback', data);
    return response.data;
  },

  async updateFeedbackStatus(id: string, data: UpdateStatusDto): Promise<Feedback> {
    const response = await api.patch(`/feedback/${id}/status`, data);
    return response.data;
  },

  async addResponse(feedbackId: string, data: CreateResponseDto): Promise<FeedbackResponse> {
    const response = await api.post(`/feedback/${feedbackId}/responses`, data);
    return response.data;
  },

  async createIssue(feedbackId: string, data: CreateIssueDto): Promise<Issue> {
    const response = await api.post(`/feedback/${feedbackId}/issues`, data);
    return response.data;
  },

  async updateIssueStatus(id: string, data: UpdateStatusDto): Promise<Issue> {
    const response = await api.patch(`/feedback/issues/${id}/status`, data);
    return response.data;
  },

  async assignIssue(id: string, data: AssignIssueDto): Promise<Issue> {
    const response = await api.patch(`/feedback/issues/${id}/assign`, data);
    return response.data;
  },
}; 