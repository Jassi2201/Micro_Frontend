export const FILE_BASE_URL = 'http://localhost:3000';
export const API_BASE_URL = `${FILE_BASE_URL}/api`;

const api = {
  async request(endpoint, method = 'GET', data = null, isAdmin = false, isFormData = false) {
    const url = `${API_BASE_URL}${isAdmin ? '/admin' : '/user'}${endpoint}`;
    
    let headers = {};
    let body = data;

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
      if (data) {
        body = JSON.stringify(data);
      }
    }

    const config = {
      method,
      headers,
      body
    };

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Something went wrong');
    }

    return responseData;
  },

  // Admin APIs
  addCategory(name) {
    return this.request('/categories', 'POST', { name }, true);
  },
  getAllCategories() {
    return this.request('/categories', 'GET', null, true);
  },
   addQuestion(formData) {
    return this.request('/questions', 'POST', formData, true, true);
  },
  bulkAddQuestions(questions) {
    return this.request('/questions/bulk', 'POST', { questions }, true);
  },
  createTestAssignment(assignmentData) {
    return this.request('/assignments', 'POST', assignmentData, true);
  },
  getCategoryQuestions(categoryId) {
    return this.request(`/categories/${categoryId}/questions`, 'GET', null, true);
  },
  getUserHistory(userId) {
    return this.request(`/users/${userId}/history`, 'GET', null, true);
  },
  getQuestionMastery(userId, questionId) {
    return this.request(`/users/${userId}/questions/${questionId}/mastery`, 'GET', null, true);
  },

    getAllAssignments() {
    return this.request('/assignments', 'GET', null, true);
  },

  getAllRegularUsers(){
return this.request('/getAllRegularUsers', 'GET', null, true);
  },

    getAssignmentDetails(assignmentId) {
    return this.request(`/assignments/${assignmentId}`, 'GET', null, true);
  },

  // User APIs
  getUserAssignmentCompletionDetails(userId) {
    return this.request(`/${userId}/assignments/completion-details`, 'GET');
  },
  getAssignmentQuestions(userId, assignmentId) {
    return this.request(`/${userId}/assignments/${assignmentId}/questions`, 'GET');
  },
  submitResponse(responseData) {
    return this.request('/responses', 'POST', responseData);
  },
  getUserProgress(userId) {
    return this.request(`/${userId}/progress`, 'GET');
  },
  login(credentials) {
    return this.request('/login', 'POST', credentials);
  },
  submitAssignment(userId, assignmentId, responses) {
    return this.request(`/${userId}/assignments/${assignmentId}/submit`, 'POST', { responses });
  },
  getAssignmentResults(userId, assignmentId) {
    return this.request(`/${userId}/assignments/${assignmentId}/results`, 'GET');
  }
};

export default api;
