<template>
  <div class="json-formatter">
    <!-- 操作按钮区域 -->
    <div class="json-formatter-actions">
      <a-button type="primary" @click="formatJSON" :disabled="!inputValue">
        <template #icon>
          <FormatPainterOutlined />
        </template>
        格式化JSON
      </a-button>
      <a-button @click="clearInput">
        <template #icon>
          <ClearOutlined />
        </template>
        清空
      </a-button>
      <a-button @click="copyOutput" v-if="outputValue">
        <template #icon>
          <CopyOutlined />
        </template>
        复制
      </a-button>
    </div>

    <!-- 主内容区域 -->
    <div class="json-formatter-content">
      <!-- 左侧输入区域 -->
      <div class="json-input-container">
        <div class="container-header">
          <h3>输入JSON</h3>
        </div>
        <div class="container-body">
          <a-textarea
            v-model:value="inputValue"
            placeholder="请输入JSON数据..."
            class="json-input"
          />
        </div>
      </div>

      <!-- 右侧输出区域 -->
      <div class="json-output-container">
        <div class="container-header">
          <h3>格式化结果</h3>
        </div>
        <div class="container-body">
          <pre v-if="outputValue" class="json-output">{{ outputValue }}</pre>
          <div v-else class="json-output-empty">
            {{ errorMessage || '格式化后的JSON将显示在这里' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FormatPainterOutlined, ClearOutlined, CopyOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

// 输入的JSON字符串
const inputValue = ref('');

// 输出的格式化JSON字符串
const outputValue = ref('');

// 错误信息
const errorMessage = ref('');

// 格式化JSON
const formatJSON = () => {
  try {
    errorMessage.value = '';
    // 解析JSON
    const parsed = JSON.parse(inputValue.value);
    // 格式化JSON
    outputValue.value = JSON.stringify(parsed, null, 2);
    message.success('JSON格式化成功');
  } catch (error) {
    outputValue.value = '';
    errorMessage.value = `JSON解析错误: ${(error as Error).message}`;
    message.error('JSON格式错误');
  }
};

// 清空输入
const clearInput = () => {
  inputValue.value = '';
  outputValue.value = '';
  errorMessage.value = '';
};

// 复制输出结果
const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputValue.value);
    message.success('复制成功');
  } catch (error) {
    message.error('复制失败');
  }
};
</script>

<style scoped>
.json-formatter {
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.json-formatter-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.json-formatter-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 500px;
}

@media (max-width: 768px) {
  .json-formatter-content {
    grid-template-columns: 1fr;
    height: auto;
  }
}

.json-input-container,
.json-output-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container-header {
  padding: 12px 16px;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.container-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #334155;
}

.container-body {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  position: relative;
}

.json-input {
  width: 100%;
  height: 100%;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  resize: none;
}

.json-output {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.json-output-empty {
  width: 100%;
  height: 100%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #94a3b8;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-align: center;
}
</style>