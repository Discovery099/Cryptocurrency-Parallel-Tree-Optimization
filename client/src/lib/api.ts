import { apiRequest } from "./queryClient";

// GPU API functions
export const gpuApi = {
  getAll: () => apiRequest('GET', '/api/gpus', undefined),
  getById: (id: string) => apiRequest('GET', `/api/gpus/${id}`, undefined),
  create: (data: any) => apiRequest('POST', '/api/gpus', data),
  update: (id: string, data: any) => apiRequest('PUT', `/api/gpus/${id}`, data),
  delete: (id: string) => apiRequest('DELETE', `/api/gpus/${id}`, undefined),
  optimize: () => apiRequest('POST', '/api/gpus/optimize', {}),
};

// Mining Pool API functions
export const miningPoolApi = {
  getAll: () => apiRequest('GET', '/api/mining-pools', undefined),
  create: (data: any) => apiRequest('POST', '/api/mining-pools', data),
  update: (id: string, data: any) => apiRequest('PUT', `/api/mining-pools/${id}`, data),
  delete: (id: string) => apiRequest('DELETE', `/api/mining-pools/${id}`, undefined),
  activate: (id: string) => apiRequest('PUT', `/api/mining-pools/${id}/activate`, {}),
};

// Merkle Tree Config API functions
export const merkleConfigApi = {
  getAll: () => apiRequest('GET', '/api/merkle-configs', undefined),
  create: (data: any) => apiRequest('POST', '/api/merkle-configs', data),
  update: (id: string, data: any) => apiRequest('PUT', `/api/merkle-configs/${id}`, data),
  activate: (id: string) => apiRequest('PUT', `/api/merkle-configs/${id}/activate`, {}),
  optimize: () => apiRequest('POST', '/api/merkle-configs/optimize', {}),
};

// Analytics API functions
export const analyticsApi = {
  getDashboardMetrics: () => apiRequest('GET', '/api/dashboard/metrics', undefined),
  getChartData: (period: string) => apiRequest('GET', `/api/dashboard/chart-data/${period}`, undefined),
  getPerformance: (hours: number) => apiRequest('GET', `/api/analytics/performance/${hours}`, undefined),
  getTransactions: (hours: number) => apiRequest('GET', `/api/analytics/transactions/${hours}`, undefined),
};

// Alerts API functions
export const alertsApi = {
  getAll: (limit?: number) => apiRequest('GET', `/api/alerts${limit ? `?limit=${limit}` : ''}`, undefined),
  getUnread: () => apiRequest('GET', '/api/alerts/unread', undefined),
  create: (data: any) => apiRequest('POST', '/api/alerts', data),
  markAsRead: (id: string) => apiRequest('PUT', `/api/alerts/${id}/read`, {}),
  clearAll: () => apiRequest('DELETE', '/api/alerts', undefined),
};

// Configuration API functions
export const configApi = {
  getAll: () => apiRequest('GET', '/api/configs', undefined),
  update: (key: string, value: any) => apiRequest('PUT', `/api/configs/${key}`, { value }),
  apply: (configs: any) => apiRequest('POST', '/api/configs/apply', configs),
  optimize: () => apiRequest('POST', '/api/configs/optimize', {}),
  export: () => apiRequest('GET', '/api/configs/export', undefined),
};

// System API functions
export const systemApi = {
  getStatus: () => apiRequest('GET', '/api/system/status', undefined),
};
