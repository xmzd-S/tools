<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>登录</h2>
        <p>欢迎回到博客系统</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-item">
          <label for="username" class="form-label">用户名/邮箱</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="请输入用户名或邮箱"
            class="form-input"
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-item">
          <div class="form-label-row">
            <label for="password" class="form-label">密码</label>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            class="form-input"
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-item remember-me-row">
          <label class="remember-me-label">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              class="checkbox"
              :disabled="isLoading"
            />
            <span class="checkbox-text">记住我</span>
          </label>
        </div>
        
        <div class="form-item">
          <button
            type="submit"
            class="login-button"
            :disabled="isLoading || !isFormValid"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>登录</span>
          </button>
        </div>
        
        <div class="form-footer">
          <p>还没有账号？ <a href="#" class="register-link">立即注册</a></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 登录表单数据
const form = ref({
  username: '',
  password: '',
  rememberMe: false
});

const isLoading = ref(false);
const error = ref<string | null>(null);

// 表单验证
const isFormValid = computed(() => {
  return form.value.username.trim() && form.value.password.trim();
});

// 处理登录
const handleLogin = async () => {
  if (!isFormValid.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    await authStore.login({
      username: form.value.username,
      password: form.value.password
    });
    
    // 获取登录前的跳转地址，默认跳转到首页
    const redirect = route.query.redirect as string || '/';
    router.push(redirect);
  } catch (err: any) {
    error.value = err.message || '登录失败，请稍后重试';
    console.error('登录失败:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.forgot-password {
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #764ba2;
  text-decoration: underline;
}

.form-input {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.remember-me-row {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.remember-me-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  text-align: center;
  margin-top: 10px;
}

.form-footer p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>