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
    console.log('Sending request to:', url)
    console.log('Request body:', JSON.stringify({
      model: config.model,
      messages: [
        ...messages.filter(msg => msg.id !== 'welcome').map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: prompt }
      ],
      stream: true
    }, null, 2))
    // 构建请求体，确保只包含当前用户消息之前的历史消息
    // 注意：messages 数组已经包含了刚刚添加的当前用户消息，所以需要去掉最后一个元素
    const requestMessages = messages
      .filter(msg => msg.id !== 'welcome')
      .slice(0, -1) // 去掉最后一个消息（当前用户消息）
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))

    // 添加当前用户消息
    requestMessages.push({ role: 'user', content: prompt })

    const requestBody = {
      model: config.model,
      messages: requestMessages,
      stream: true
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers))
    console.log('Response content-type:', response.headers.get('content-type'))

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
        console.error('Failed to parse error response:', jsonError)
      }
      throw new Error(errorMessage)
    }

    if (!response.body) {
      throw new Error('无法获取响应流')
    }

    const reader = response.body.getReader()
    console.log('Created reader:', reader)

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      console.log('Reader read result:', { done, value: value ? `${value.byteLength} bytes` : null })
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      console.log('Buffer after decode:', buffer)
      
      // 处理 OpenAI API 流式响应格式
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim() === '') continue
        
        // 检查是否是 SSE 数据行（以 "data: " 开头）
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim()
          
          if (dataStr === '[DONE]') {
            // 流式结束标记
            continue
          }
          
          try {
            const json = JSON.parse(dataStr)
            const content = json.choices[0]?.delta?.content
            if (content) {
              console.log('Received chunk:', content)
              onChunk(content)
            }
          } catch (e) {
            console.error('解析流式响应错误:', e)
            console.error('错误数据行:', line)
          }
        }
      }
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
