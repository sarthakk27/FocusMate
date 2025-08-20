import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


const getCSRFToken = async () => {
  try {
    await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
  }
};


api.interceptors.request.use(async (config) => {
  const csrfToken = getCookie('csrftoken');
  if (!csrfToken) {

    await getCSRFToken();
  }
  const token = getCookie('csrftoken');
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
});

// Helper function to get cookie value
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Authentication services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/user/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Dashboard services
export const dashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Notes services
export const notesService = {
  getAllNotes: async () => {
    try {
      const response = await api.get('/notes/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createNote: async (noteData) => {
    try {
      const response = await api.post('/notes/', noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/notes/${id}/`, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/notes/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Daily Plans services
export const dailyPlansService = {
  getDailyPlans: async (date = null) => {
    try {
      const url = date ? `/daily-plans/?date=${date}` : '/daily-plans/';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createDailyPlan: async (planData) => {
    try {
      const response = await api.post('/daily-plans/', planData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateDailyPlan: async (id, planData) => {
    try {
      const response = await api.put(`/daily-plans/${id}/`, planData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDailyPlan: async (id) => {
    try {
      const response = await api.delete(`/daily-plans/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  toggleCompletion: async (id, isCompleted) => {
    try {
      const response = await api.patch(`/daily-plans/${id}/`, { is_completed: isCompleted });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Study Sessions services
export const studySessionsService = {
  getAllSessions: async () => {
    try {
      const response = await api.get('/study-sessions/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createSession: async (sessionData) => {
    try {
      const response = await api.post('/study-sessions/', sessionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSession: async (id, sessionData) => {
    try {
      const response = await api.put(`/study-sessions/${id}/`, sessionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteSession: async (id) => {
    try {
      const response = await api.delete(`/study-sessions/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Goals services
export const goalsService = {
  getAllGoals: async () => {
    try {
      const response = await api.get('/goals/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await api.post('/goals/', goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateGoal: async (id, goalData) => {
    try {
      const response = await api.put(`/goals/${id}/`, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteGoal: async (id) => {
    try {
      const response = await api.delete(`/goals/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Statistics services
export const statisticsService = {
  getStudyStatistics: async () => {
    try {
      const response = await api.get('/statistics/study/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProductivitySummary: async () => {
    try {
      const response = await api.get('/statistics/productivity/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
