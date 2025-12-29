<template>
  <div class="ai-chat-container">
    <div class="chat-header">
      <h2>AI 聊天助手</h2>
      <a-button type="primary" @click="showConfigModal = true">
        <template #icon>
          <SettingOutlined />
        </template>
        配置
      </a-button>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" class="message-item">
        <div class="message-avatar">
          <a-avatar v-if="message.role === 'user'">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <a-avatar v-else>
            <template #icon>
              <RobotOutlined />
            </template>
          </a-avatar>
        </div>
        <div class="message-content">
          <div class="message-bubble" :class="message.role">
            <div v-html="message.content"></div>
            <div class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</div>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="message-item">
        <div class="message-avatar">
          <a-avatar :icon="RobotOutlined" />
        </div>
        <div class="message-content">
          <div class="message-bubble assistant">
            <div class="loading-indicator">
          <a-spin size="small" />
          <span class="typing-text">正在思考...</span>
        </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <a-input
        v-model:value="inputValue"
        :disabled="isLoading"
        placeholder="请输入您的问题...（支持 Ctrl+Enter 发送）"
        @keyup.enter="handleSend"
        @keyup.ctrl.enter="handleSend"
        @keyup.meta.enter="handleSend"
      />
      <a-button type="primary" @click="handleSend" :disabled="isLoading || !inputValue.trim()">
        <template #icon>
          <SendOutlined />
        </template>
        发送
      </a-button>
    </div>

    <!-- 配置模态框 -->
    <a-modal
      v-model:open="showConfigModal"
      title="API 配置"
      @ok="saveConfig"
      @cancel="showConfigModal = false"
    >
      <a-form layout="vertical">
        <a-form-item label="API Key">
          <a-input-password
            v-model:value="config.apiKey"
            placeholder="请输入 OpenAI API Key"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="模型名称">
          <a-input
            v-model:value="config.model"
            placeholder="请输入模型名称，如 gpt-3.5-turbo"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="API 基础 URL">
          <a-input
            v-model:value="config.baseUrl"
            placeholder="请输入 API 基础 URL，默认为 https://api.openai.com/v1"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  SettingOutlined,
  UserOutlined,
  RobotOutlined,
  SendOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Config {
  apiKey: string
  model: string
  baseUrl: string
}

// 状态管理
const messages = ref<Message[]>([])
const inputValue = ref('')
const isLoading = ref(false)
const showConfigModal = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// 配置
const config = ref<Config>({
  apiKey: localStorage.getItem('openai-api-key') || '',
  model: localStorage.getItem('openai-model') || 'gpt-3.5-turbo',
  baseUrl: localStorage.getItem('openai-base-url') || 'https://api.openai.com/v1'
})

// 保存配置
const saveConfig = () => {
  localStorage.setItem('openai-api-key', config.value.apiKey)
  localStorage.setItem('openai-model', config.value.model)
  localStorage.setItem('openai-base-url', config.value.baseUrl)
  message.success('配置已保存')
  showConfigModal.value = false
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    // 使用 requestAnimationFrame 优化滚动性能
    requestAnimationFrame(() => {
      messagesContainer.value!.scrollTop = messagesContainer.value!.scrollHeight
    })
  }
}

// 检查是否需要自动滚动到底部
const shouldAutoScroll = () => {
  if (!messagesContainer.value) return true
  
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  // 如果当前滚动位置接近底部（100px以内），则自动滚动
  return scrollHeight - scrollTop - clientHeight < 100
}

// 格式化时间戳
const formatTimestamp = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 监听消息变化，自动滚动到底部（仅当用户已经在底部时）
watch(messages, () => {
  if (shouldAutoScroll()) {
    scrollToBottom()
  }
}, { deep: true })

// 初始化欢迎消息
onMounted(() => {
  messages.value = [
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是您的 AI 助手，有什么可以帮助您的吗？' +
        '<br/><br/>' +
        '请先点击右上角的「配置」按钮，设置您的 OpenAI API Key 和模型名称。',
      timestamp: new Date()
    }
  ]
})

// 处理发送消息
const handleSend = async () => {
  const content = inputValue.value.trim()
  if (!content) return
  if (!config.value.apiKey) {
    message.error('请先配置 API Key')
    showConfigModal.value = true
    return
  }
  if (!config.value.model) {
    message.error('请先配置模型名称')
    showConfigModal.value = true
    return
  }

  // 添加用户消息
  const userMessage: Message = {
    id: Date.now().toString() + '-user',
    role: 'user',
    content,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  inputValue.value = ''

  isLoading.value = true

  try {
    // 创建助手消息占位符
    const assistantMessage: Message = {
      id: Date.now().toString() + '-assistant',
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }
    messages.value.push(assistantMessage)

    // 调用 API 获取响应
    await callOpenAIStream(content, (chunk: string) => {
      assistantMessage.content = chunk
    })
  } catch (error) {
    console.error('API 调用错误:', error)
    
    // 根据错误类型显示不同的错误信息
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      message.error('网络连接失败，请检查您的网络设置')
    } else if (error instanceof Error) {
      message.error(`请求失败: ${error.message}`)
    } else {
      message.error('请求失败，请检查您的配置和网络连接')
    }
    
    // 更新助手消息显示错误信息
    const lastMessage = messages.value[messages.value.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.content = `❌ 请求失败: ${error instanceof Error ? error.message : '未知错误'}`
    }
  } finally {
    isLoading.value = false
  }
}

// 调用 OpenAI API 流式接口
const callOpenAIStream = async (prompt: string, onChunk: (chunk: string) => void) => {
  const baseUrl = config.value.baseUrl || 'https://api.openai.com/v1'
  const url = `${baseUrl}/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.value.apiKey}`
    },
    body: JSON.stringify({
      model: config.value.model,
      messages: [
        ...messages.value.filter(msg => msg.id !== 'welcome').map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: prompt }
      ],
      stream: true
    })
  })

  if (!response.ok) {
    // 尝试解析 API 返回的错误信息
    try {
      const errorData = await response.json()
      if (errorData.error) {
        throw new Error(`API 请求失败: ${errorData.error.message || errorData.error.code}`)
      }
    } catch (jsonError) {
      // 如果无法解析 JSON，则使用状态文本
    }
    throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('无法获取响应流')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    
    // 处理 SSE 响应格式
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      
      const data = line.slice(6).trim()
      if (data === '[DONE]') continue

      try {
        const json = JSON.parse(data)
        const content = json.choices[0]?.delta?.content
        if (content) {
          onChunk(content)
        }
      } catch (e) {
        console.error('解析流式响应错误:', e)
      }
    }
  }
}
</script>

<style scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.chat-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #f8fafc;
  background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
  background-size: 20px 20px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.message-avatar .ant-avatar {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-content {
  flex: 1;
  max-width: 75%;
}

.message-bubble {
  padding: 14px 18px;
  border-radius: 18px;
  word-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.message-bubble.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message-bubble.assistant {
  background-color: #fff;
  color: #1f2937;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.message-timestamp {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

/* 代码块样式 */
.message-bubble pre {
  background-color: #1f2937;
  color: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 8px 0;
  border: 1px solid #374151;
}

.message-bubble code {
  background-color: rgba(31, 41, 55, 0.1);
  color: #1f2937;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
}

.message-bubble.user code {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.message-bubble pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
}

.typing-text {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 1s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #64748b }
}

.typing-text::after {
  content: '|';
  position: absolute;
  right: 0;
  animation: blink 1s infinite;
  color: #667eea;
}

@keyframes blink {
  0%, 100% { opacity: 1 }
  50% { opacity: 0 }
}

.chat-input {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  background-color: #fff;
  border-top: 1px solid #e2e8f0;
}

.chat-input .ant-input {
  flex: 1;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.chat-input .ant-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chat-input .ant-btn {
  border-radius: 24px;
  padding: 12px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background-color: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-container {
    max-width: 100%;
    border-radius: 0;
    height: 100vh;
  }

  .chat-header {
    padding: 12px 16px;
  }

  .chat-header h2 {
    font-size: 16px;
  }

  .chat-messages {
    padding: 16px;
  }

  .message-content {
    max-width: 85%;
  }

  .message-bubble {
    padding: 12px 16px;
  }

  .chat-input {
    padding: 12px 16px;
  }
}

@media (max-width: 480px) {
  .chat-messages {
    padding: 12px;
  }

  .message-content {
    max-width: 90%;
  }

  .chat-input {
    padding: 8px 12px;
  }

  .chat-input .ant-input {
    padding: 8px 12px;
  }

  .chat-input .ant-btn {
    padding: 8px 16px;
  }
}
</style>