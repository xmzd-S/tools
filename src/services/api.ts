import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 定义响应数据类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 错误处理函数
const handleError = (error: any): never => {
  let errorMessage = '请求失败，请稍后重试';
  
  if (error.response) {
    // 服务器返回错误响应
    const { status, data } = error.response;
    switch (status) {
      case 400:
        errorMessage = data.message || '请求参数错误';
        break;
      case 401:
        errorMessage = data.message || '未授权，请重新登录';
        // 可以在这里处理登录过期，比如跳转到登录页
        break;
      case 403:
        errorMessage = data.message || '禁止访问';
        break;
      case 404:
        errorMessage = data.message || '资源不存在';
        break;
      case 500:
        errorMessage = data.message || '服务器内部错误';
        break;
      default:
        errorMessage = data.message || `请求失败: ${status}`;
    }
  } else if (error.request) {
    // 请求发出但没有收到响应
    errorMessage = '服务器无响应，请检查网络连接';
  } else {
    // 请求配置错误
    errorMessage = error.message || '请求配置错误';
  }
  
  throw new Error(errorMessage);
};

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data;
    if (code === 200) {
      return data;
    } else {
      // 业务错误，抛出异常
      throw new Error(message || '请求失败');
    }
  },
  (error) => {
    // 处理401未授权响应
    if (error.response && error.response.status === 401) {
      // 清除本地token和用户信息
      localStorage.removeItem('token');
      // 跳转到登录页
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    }
    return Promise.reject(handleError(error));
  }
);

// 封装请求方法
export const api = {
  get: <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, { params, ...config });
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config);
  },
  
  delete: <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, { params, ...config });
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch(url, data, config);
  },
  
  upload: <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress);
        }
      },
    });
  },
};

export default api;