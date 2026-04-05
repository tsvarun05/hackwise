import api from "./api";

// GET /questions?domain=webdev  → pre-assessment questions
// GET /questions?concept=HTML   → module quiz questions
export const getQuestions = (domain, concept) => {
  const params = {};
  if (domain) params.domain = domain;
  if (concept) params.concept = concept;
  return api.get("/questions", { params });
};

// POST /responses
export const submitResponses = (userId, answers) =>
  api.post("/responses", { userId, answers });

// POST /evaluation/{userId}
export const runEvaluation = (userId) => api.post(`/evaluation/${userId}`);

// GET /roadmap/{userId}?domain=webdev
export const getRoadmap = (userId, domain) => {
  const params = domain ? { params: { domain } } : {};
  return api.get(`/roadmap/${userId}`, params);
};

// GET /modules/{moduleId}
export const getModule = (moduleId) => api.get(`/modules/${moduleId}`);

// POST /progress
export const completeModule = (userId, moduleId) =>
  api.post("/progress", { userId, moduleId });

// GET /course/{courseId}?userId=xxx
export const getCourse = (courseId, userId) =>
  api.get(`/course/${courseId}`, { params: { userId } });

// GET /course/quiz/{unitId}
export const getUnitQuiz = (unitId) => api.get(`/course/quiz/${unitId}`);

// POST /ai/insights
export const getInsights = (userId, domain) =>
  api.post("/ai/insights", { userId, domain });

// POST /ai/roadmap
export const getAIRoadmap = (weakConcepts) =>
  api.post("/ai/roadmap", { weakConcepts });

// POST /mentor/chat
export const chatAPI = {
  sendMessage: (message) => api.post("/mentor/chat", { message }),
};
