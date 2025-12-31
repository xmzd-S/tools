import api from './api';

// 用户模型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求类型
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  user: User;
}

// 刷新令牌请求类型
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 刷新令牌响应类型
export interface RefreshTokenResponse {
  token: string;
}

// 用户认证API服务
export const authApi = {
  // 用户登录
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return api.post('/auth/login', data);
  },

  // 用户注册
  register: (data: RegisterRequest): Promise<LoginResponse> => {
    return api.post('/auth/register', data);
  },

  // 获取当前用户信息
  getCurrentUser: (): Promise<{ user: User }> => {
    return api.get('/auth/me');
  },

  // 用户登出
  logout: (): Promise<void> => {
    return api.post('/auth/logout');
  },

  // 刷新令牌
  refreshToken: (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return api.post('/auth/refresh', data);
  },
};

export default authApi;