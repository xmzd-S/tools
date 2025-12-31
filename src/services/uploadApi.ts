import api from './api';

// 文件上传响应类型
export interface UploadResponse {
  url: string;
  filename: string;
}

// 文件上传进度回调类型
export type UploadProgressCallback = (progress: number) => void;

// 文件上传API服务
export const uploadApi = {
  // 上传文件
  uploadFile: (file: File, onProgress?: UploadProgressCallback): Promise<UploadResponse> => {
    return api.upload('/upload', file, onProgress);
  },

  // 上传图片
  uploadImage: (file: File, onProgress?: UploadProgressCallback): Promise<UploadResponse> => {
    return api.upload('/upload/image', file, onProgress);
  },
};

export default uploadApi;