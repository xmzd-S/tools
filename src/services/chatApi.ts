// Chat API 服务

// 定义消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 定义API配置类型
export interface ChatConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

// 定义流式响应处理回调类型
export type StreamCallback = (chunk: string) => void;

/**
 * 调用 OpenAI API 流式接口 (SSE 方式)
 * @param prompt 用户输入的提示词
 * @param messages 历史消息列表
 * @param config API 配置
 * @param onChunk 流式响应处理回调
 */
export const callOpenAIStream = async (
  prompt: string,
  messages: Message[],
  config: ChatConfig,
  onChunk: StreamCallback
): Promise<void> => {
  const baseUrl = config.baseUrl || 'https://api.openai.com/v1'
  const url = `${baseUrl}/chat/completions`

  const controller = new AbortController()
  const signal = controller.signal

  // 设置请求超时
  const timeoutId = setTimeout(() => {
    controller.abort()
    throw new Error('请求超时')
  }, 60000) // 60秒超时

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          ...messages.filter(msg => msg.id !== 'welcome').map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: prompt }
        ],
        stream: true
      }),
      signal
    })

    if (!response.ok) {
      // 尝试解析 API 返回的错误信息
      let errorMessage = `API 请求失败: ${response.status} ${response.statusText}`
      try {
        const errorData = await response.json()
        if (errorData.error) {
          errorMessage = `API 请求失败: ${errorData.error.message || errorData.error.code}`
        }
      } catch (jsonError) {
        // 如果无法解析 JSON，则使用状态文本
      }
      throw new Error(errorMessage)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法获取响应流')
    }

    const decoder = new TextDecoder()
    let buffer = ''
    let currentEvent = { event: 'message', data: '', id: '' }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      
      // 处理 SSE 响应格式（符合标准 SSE 规范）
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim() === '') {
          // 空行表示事件结束，处理当前事件
          if (currentEvent.data) {
            if (currentEvent.data.trim() === '[DONE]') {
              // 流式结束标记
              break
            }
            
            try {
              const json = JSON.parse(currentEvent.data)
              const content = json.choices[0]?.delta?.content
              if (content) {
                onChunk(content)
              }
            } catch (e) {
              console.error('解析流式响应错误:', e)
            }
          }
          // 重置当前事件
          currentEvent = { event: 'message', data: '', id: '' }
          continue
        }

        // 解析 SSE 字段
        // 支持: event: message, data: {json}, id: 123
        const fieldMatch = line.match(/^(\w+):(?:\s+)?(.+)?$/)
        if (!fieldMatch) continue

        const [, field, value] = fieldMatch
        
        switch (field) {
          case 'event':
            currentEvent.event = value?.trim() || 'message'
            break
          case 'data':
            // 处理多行数据（以空格开头的行是上一行的延续）
            if (value && value.startsWith(' ')) {
              currentEvent.data += value
            } else {
              currentEvent.data += (value || '') + '\n'
            }
            break
          case 'id':
            currentEvent.id = value?.trim() || ''
            break
          // 忽略其他字段
        }
      }
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
