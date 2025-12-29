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
          <a-avatar :icon="message.role === 'user' ? <UserOutlined /> : <RobotOutlined />" />
        </div>
        <div class="message-content">
          <div class="message-bubble" :class="message.role">
            <div v-html="message.content"></div>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="message-item">
        <div class="message-avatar">
          <a-avatar :icon="<RobotOutlined />" />
        </div>
        <div class="message-content">
          <div class="message-bubble assistant">
            <div class="loading-indicator">
              <a-spin size="small" />
              <span>正在思考...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <a-input
        v-model:value="inputValue"
        :disabled="isLoading"
        placeholder="请输入您的问题..."
        @keyup.enter="handleSend"
        :prefix="<MessageOutlined />"
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
  MessageOutlined,
  SendOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
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
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  setTimeout(scrollToBottom, 100)
}, { deep: true })

// 初始化欢迎消息
onMounted(() => {
  messages.value = [
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是您的 AI 助手，有什么可以帮助您的吗？' +
        '<br/><br/>' +
        '请先点击右上角的「配置」按钮，设置您的 OpenAI API Key 和模型名称。'
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
    content
  }
  messages.value.push(userMessage)
  inputValue.value = ''

  isLoading.value = true

  try {
    // 创建助手消息占位符
    const assistantMessage: Message = {
      id: Date.now().toString() + '-assistant',
      role: 'assistant',
      content: ''
    }
    messages.value.push(assistantMessage)

    // 调用 API 获取响应
    await callOpenAIStream(content, (chunk: string) => {
      assistantMessage.content = chunk
    })
  } catch (error) {
    console.error('API 调用错误:', error)
    message.error('请求失败，请检查您的配置和网络连接')
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
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.chat-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #fafafa;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 8px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-bubble.user {
  background-color: #1890ff;
  color: #fff;
  margin-left: auto;
  border-bottom-right-radius: 2px;
}

.message-bubble.assistant {
  background-color: #fff;
  color: #333;
  border: 1px solid #e8e8e8;
  border-bottom-left-radius: 2px;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.chat-input {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
}

.chat-input .ant-input {
  flex: 1;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}
</style>