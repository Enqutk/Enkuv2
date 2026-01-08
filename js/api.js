// API Service for Frontend
// Automatically detect API URL based on environment
const API_BASE_URL = (() => {
  // If we're on the same domain (Vercel deployment), use relative URL
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  // Local development - use port 3001
  return 'http://localhost:3001/api';
})();

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get auth headers
  getHeaders(includeAuth = true, isFormData = false) {
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Handle response
  async handleResponse(response) {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      const errorMessage = errorData.error || errorData.message || `Request failed (${response.status})`;
      throw new Error(errorMessage);
    }
    try {
      return await response.json();
    } catch (e) {
      // If response is not JSON, return success anyway
      return { success: true };
    }
  }

  // Authentication
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password })
    });
    const data = await this.handleResponse(response);
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Blog
  async getBlogPosts(featured = false, limit = null) {
    let url = `${API_BASE_URL}/blog?featured=${featured}`;
    if (limit) url += `&limit=${limit}`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async getBlogPost(id) {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`);
    return this.handleResponse(response);
  }

  async createBlogPost(formData) {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: 'POST',
      headers: this.getHeaders(true, true),
      body: formData
    });
    return this.handleResponse(response);
  }

  async updateBlogPost(id, formData) {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true, true),
      body: formData
    });
    return this.handleResponse(response);
  }

  async deleteBlogPost(id) {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Gallery
  async getGalleryItems(limit = null) {
    let url = `${API_BASE_URL}/gallery`;
    if (limit) url += `?limit=${limit}`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async getGalleryItem(id) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`);
    return this.handleResponse(response);
  }

  async createGalleryItem(formData) {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: this.getHeaders(true, true),
      body: formData
    });
    return this.handleResponse(response);
  }

  async updateGalleryItem(id, formData) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true, true),
      body: formData
    });
    return this.handleResponse(response);
  }

  async deleteGalleryItem(id) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Comments
  async getComments(postId) {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    return this.handleResponse(response);
  }

  async createComment(blogPostId, name, email, content) {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ blog_post_id: blogPostId, name, email, content })
    });
    return this.handleResponse(response);
  }

  // Newsletter
  async subscribeNewsletter(email, name = null) {
    const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, name })
    });
    return this.handleResponse(response);
  }

  // Contact
  async sendContactMessage(name, email, subject, message) {
    try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ name, email, subject, message })
    });
      return await this.handleResponse(response);
    } catch (error) {
      // If API is not available, throw a user-friendly error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to server. Please check your connection or contact me directly via email.');
      }
      throw error;
    }
  }

  // Analytics
  async trackPageView(page) {
    try {
      await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ page })
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Testimonials
  async getTestimonials(approved = true) {
    let url = `${API_BASE_URL}/testimonials`;
    if (approved !== null) url += `?approved=${approved}`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async createTestimonial(name, role, email, quote, rating = 5, avatar = null) {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ name, role, email, quote, rating, avatar })
    });
    return this.handleResponse(response);
  }

  async updateTestimonial(id, data) {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse(response);
  }

  async approveTestimonial(id) {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}/approve`, {
      method: 'PATCH',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async deleteTestimonial(id) {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Projects
  async getProjects(limit = null) {
    let url = `${API_BASE_URL}/projects`;
    if (limit) url += `?limit=${limit}`;
    const response = await fetch(url);
    return this.handleResponse(response);
  }

  async getProject(id) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    return this.handleResponse(response);
  }

  async createProject(formData) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: this.getHeaders(true, true),
      body: formData
    });
    return this.handleResponse(response);
  }

  async updateProject(id, formData) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true, true),
      body: formData
    });
    return this.handleResponse(response);
  }

  async deleteProject(id) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }
}

// Create global instance
const api = new ApiService();

