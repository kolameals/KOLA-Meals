import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedbackService, type Feedback, type FeedbackResponse, type Issue, type CreateFeedbackDto, type CreateResponseDto, type CreateIssueDto, type UpdateStatusDto, type AssignIssueDto } from '../../services/feedback.service';

interface FeedbackState {
  feedbacks: Feedback[];
  currentFeedback: Feedback | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedbacks: [],
  currentFeedback: null,
  loading: false,
  error: null
};

export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchAll',
  async (filters?: { type?: string; status?: string; userId?: string }) => {
    return await feedbackService.getFeedbacks(filters);
  }
);

export const fetchFeedbackById = createAsyncThunk(
  'feedback/fetchById',
  async (id: string) => {
    return await feedbackService.getFeedbackById(id);
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/create',
  async (data: CreateFeedbackDto) => {
    return await feedbackService.createFeedback(data);
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'feedback/updateStatus',
  async ({ id, data }: { id: string; data: UpdateStatusDto }) => {
    return await feedbackService.updateFeedbackStatus(id, data);
  }
);

export const addResponse = createAsyncThunk(
  'feedback/addResponse',
  async ({ feedbackId, data }: { feedbackId: string; data: CreateResponseDto }) => {
    return await feedbackService.addResponse(feedbackId, data);
  }
);

export const createIssue = createAsyncThunk(
  'feedback/createIssue',
  async ({ feedbackId, data }: { feedbackId: string; data: CreateIssueDto }) => {
    return await feedbackService.createIssue(feedbackId, data);
  }
);

export const updateIssueStatus = createAsyncThunk(
  'feedback/updateIssueStatus',
  async ({ id, data }: { id: string; data: UpdateStatusDto }) => {
    return await feedbackService.updateIssueStatus(id, data);
  }
);

export const assignIssue = createAsyncThunk(
  'feedback/assignIssue',
  async ({ id, data }: { id: string; data: AssignIssueDto }) => {
    return await feedbackService.assignIssue(id, data);
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentFeedback: (state) => {
      state.currentFeedback = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feedbacks';
      })
      // Fetch by ID
      .addCase(fetchFeedbackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFeedback = action.payload;
      })
      .addCase(fetchFeedbackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feedback';
      })
      // Create
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.feedbacks.unshift(action.payload);
      })
      // Update status
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
        if (state.currentFeedback?.id === action.payload.id) {
          state.currentFeedback = action.payload;
        }
      })
      // Add response
      .addCase(addResponse.fulfilled, (state, action) => {
        if (state.currentFeedback) {
          state.currentFeedback.responses.push(action.payload);
        }
      })
      // Create issue
      .addCase(createIssue.fulfilled, (state, action) => {
        if (state.currentFeedback) {
          state.currentFeedback.issues.push(action.payload);
        }
      })
      // Update issue status
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        if (state.currentFeedback) {
          const index = state.currentFeedback.issues.findIndex(i => i.id === action.payload.id);
          if (index !== -1) {
            state.currentFeedback.issues[index] = action.payload;
          }
        }
      })
      // Assign issue
      .addCase(assignIssue.fulfilled, (state, action) => {
        if (state.currentFeedback) {
          const index = state.currentFeedback.issues.findIndex(i => i.id === action.payload.id);
          if (index !== -1) {
            state.currentFeedback.issues[index] = action.payload;
          }
        }
      });
  }
});

export const { clearError, clearCurrentFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer; 