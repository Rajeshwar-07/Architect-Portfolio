/**
 * Centralized API service using axios.
 * All HTTP calls go through this module for consistent base URL and error handling.
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Response interceptor for consistent error handling ----
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ============================================================
// Projects API
// ============================================================

export const projectsApi = {
  /** Fetch all projects */
  getAll: () => apiClient.get('/projects'),

  /** Fetch featured projects only */
  getFeatured: () => apiClient.get('/projects/featured'),

  /** Fetch a single project by ID */
  getById: (id) => apiClient.get(`/projects/${id}`),

  /** Fetch projects by category */
  getByCategory: (category) => apiClient.get(`/projects/category/${category}`),

  /**
   * Create a new project with image files.
   * @param {Object} data - { title, description, category, location, year, isFeatured }
   * @param {File[]} imageFiles - Array of File objects
   */
  create: (data, imageFiles = []) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    imageFiles.forEach((file) => formData.append('images', file));
    return apiClient.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Upload more images to an existing project.
   * @param {number} projectId
   * @param {File[]} imageFiles
   */
  addImages: (projectId, imageFiles) => {
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append('images', file));
    return apiClient.post(`/projects/${projectId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** Delete a project */
  delete: (id) => apiClient.delete(`/projects/${id}`),
};

// ============================================================
// Contact API
// ============================================================

export const contactApi = {
  /** Send a contact form message */
  sendMessage: (data) => apiClient.post('/contact', data),
};

// ============================================================
// Visitors API
// ============================================================

export const visitorsApi = {
  /**
   * Log a visitor's email.
   * Called automatically when the visitor provides their email.
   * @param {string} email
   */
  track: (email) => apiClient.post('/visitors/track', { email }),

  /** Get all visitor emails (admin use) */
  getEmails: () => apiClient.get('/visitors/emails'),

  /** Get visitor statistics */
  getStats: () => apiClient.get('/visitors/stats'),
};
