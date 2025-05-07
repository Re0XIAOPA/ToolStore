/**
 * feedback-sender.js
 * 使用AokSend API发送反馈邮件的模块
 */

class FeedbackSender {
  /**
   * 创建反馈发送器实例
   * @param {string} apiKey - AokSend API密钥
   * @param {string} targetEmail - 接收反馈的邮箱地址
   */
  constructor(apiKey = '7760eee283e34195ff390fcaf0ebd605', targetEmail = 'toolstore@awafuns.cn') {
    this.apiKey = apiKey;
    this.targetEmail = targetEmail;
    this.apiEndpoint = 'https://www.aoksend.com/index/api/send_email';  // AokSend API端点
    this.defaultConfig = {
      fromEmail: 'noreply@awafuns.cn',
      fromName: 'ToolStore反馈系统'
    };
    // 使用正确的模板ID
    this.templateId = 'E_118221062853';  // 使用实际的模板ID
    
    // 初始化限流配置
    this.rateLimit = {
      maxRequestsPerHour: 6, // 每小时最大请求数
      requestCountKey: 'feedback_request_count', // 本地存储键名
      requestTimestampKey: 'feedback_request_timestamps', // 时间戳记录键名
    };
  }

  /**
   * 检查发送频率是否超出限制
   * @returns {Object} 检查结果，包含是否允许发送和剩余等待时间
   */
  checkRateLimit() {
    try {
      // 从localStorage中获取请求次数和时间戳记录
      const countStr = localStorage.getItem(this.rateLimit.requestCountKey) || '0';
      const count = parseInt(countStr, 10);
      const timestampsStr = localStorage.getItem(this.rateLimit.requestTimestampKey) || '[]';
      let timestamps = JSON.parse(timestampsStr);
      
      // 当前时间
      const now = Date.now();
      // 一小时前的时间戳
      const oneHourAgo = now - (60 * 60 * 1000);
      
      // 过滤出一小时内的请求时间戳
      timestamps = timestamps.filter(timestamp => timestamp > oneHourAgo);
      
      // 检查一小时内的请求次数是否超过限制
      if (timestamps.length >= this.rateLimit.maxRequestsPerHour) {
        // 计算需要等待的时间（到最早那个请求满一小时）
        const oldestTimestamp = Math.min(...timestamps);
        const waitTime = oldestTimestamp + (60 * 60 * 1000) - now;
        const waitMinutes = Math.ceil(waitTime / (60 * 1000));
        
        return {
          allowed: false,
          waitTime: waitTime,
          message: `发送频率超出限制，请等待约${waitMinutes}分钟后再试`
        };
      }
      
      return { allowed: true };
    } catch (error) {
      console.error('检查发送频率时出错：', error);
      // 出错时默认允许发送，避免阻止用户正常使用
      return { allowed: true };
    }
  }
  
  /**
   * 记录发送请求
   */
  recordRequest() {
    try {
      // 当前时间戳
      const now = Date.now();
      
      // 从localStorage获取时间戳记录
      const timestampsStr = localStorage.getItem(this.rateLimit.requestTimestampKey) || '[]';
      let timestamps = JSON.parse(timestampsStr);
      
      // 一小时前的时间戳
      const oneHourAgo = now - (60 * 60 * 1000);
      
      // 过滤出一小时内的请求
      timestamps = timestamps.filter(timestamp => timestamp > oneHourAgo);
      
      // 添加当前请求的时间戳
      timestamps.push(now);
      
      // 保存回localStorage
      localStorage.setItem(this.rateLimit.requestTimestampKey, JSON.stringify(timestamps));
      localStorage.setItem(this.rateLimit.requestCountKey, timestamps.length.toString());
    } catch (error) {
      console.error('记录发送请求时出错：', error);
    }
  }

  /**
   * 发送反馈邮件
   * @param {Object} feedbackData - 反馈数据
   * @param {string} feedbackData.userEmail - 用户邮箱
   * @param {string} feedbackData.subject - 反馈主题
   * @param {string} feedbackData.content - 反馈内容
   * @returns {Promise<Object>} 发送结果
   */
  async sendFeedback(feedbackData) {
    const { userEmail, subject, content } = feedbackData;
    
    // 验证必需字段
    if (!userEmail || !subject || !content) {
      throw new Error('反馈缺少必需字段: userEmail, subject, content');
    }
    
    // 检查发送频率限制
    const rateCheckResult = this.checkRateLimit();
    if (!rateCheckResult.allowed) {
      return {
        success: false,
        error: 'rate_limit_exceeded',
        message: rateCheckResult.message
      };
    }
    
    try {
      // 验证邮箱格式
      if (!this.isValidEmail(userEmail)) {
        return {
          success: false,
          error: 'invalid_email',
          message: '请输入有效的邮箱地址'
        };
      }
      
      // 准备发送数据 - 按照模板中定义的变量名设置
      const emailData = {
        app_key: this.apiKey,
        template_id: this.templateId,
        to: this.targetEmail,
        reply_to: userEmail,
        alias: this.defaultConfig.fromName,
        data: {
          // 根据模板变量名进行匹配
          contactemail: userEmail,    // 用户邮箱变量
          subject: subject,           // 反馈标题变量
          content: content,           // 反馈内容变量
          time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) // 提交时间变量
        }
      };

      // 记录此次发送请求
      this.recordRequest();
      
      // 发送邮件
      const result = await this.sendEmail(emailData);
      
      // 转换错误消息为用户友好的提示
      if (!result.success && result.message) {
        // 处理常见的API错误
        if (result.message.includes('reply_to') || result.message.includes('邮箱')) {
          result.message = '邮箱格式填写不正确，请检查后重试';
        } else if (result.message.includes('template')) {
          result.message = '系统错误，请稍后重试';
        }
      }
      
      return {
        success: result.code === 200 || (result.message && result.message.includes("成功")),
        data: result,
        message: result.code === 200 ? '反馈已成功发送' : result.message
      };
    } catch (error) {
      console.error('反馈发送失败:', error);
      
      // 提供友好的错误消息
      let errorMessage = '反馈发送失败，请稍后重试';
      
      // 处理特定错误类型
      if (error.message && (
          error.message.includes('reply_to') || 
          error.message.includes('邮箱') || 
          error.message.includes('email'))) {
        errorMessage = '邮箱格式填写不正确，请检查后重试';
      }
      
      return {
        success: false,
        error: error.message,
        message: errorMessage
      };
    }
  }
  
  /**
   * 验证邮箱格式
   * @param {string} email - 需要验证的邮箱
   * @returns {boolean} 是否有效
   */
  isValidEmail(email) {
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * 调用AokSend API发送邮件
   * @param {Object} emailData - 邮件数据
   * @returns {Promise<Object>} API响应
   * @private
   */
  async sendEmail(emailData) {
    try {
      // console.log('正在发送邮件，API数据:', emailData);
      
      // 检测是否为开发环境
      const isDevEnvironment = window.location.hostname === '127.0.0.1' || 
                               window.location.hostname === 'localhost' ||
                               window.location.hostname.includes('192.168.') ||
                               window.location.protocol === 'file:';
      
      // 使用JSONP方式发送请求（解决CORS问题）
      return new Promise((resolve, reject) => {
        // 创建一个唯一的回调函数名
        const callbackName = 'aoksendCallback_' + Date.now() + Math.floor(Math.random() * 1000);
        
        // 定义全局回调函数
        window[callbackName] = function(response) {
          // 清理：移除脚本标签和全局回调函数
          const scriptElement = document.getElementById('aoksend_script');
          if (scriptElement) document.head.removeChild(scriptElement);
          delete window[callbackName];
          
          // 处理响应
          if (response && (response.code === 200 || (response.message && response.message.includes("成功")))) {
            resolve({
              code: 200,
              message: response.message || "邮件已发送成功"
            });
          } else if (response) {
            resolve(response);
          } else {
            // 在开发环境中模拟成功响应
            if (isDevEnvironment) {
              resolve({
                code: 200,
                message: "邮件已发送(开发环境模拟)"
              });
            } else {
              reject(new Error('未收到API响应'));
            }
          }
        };
        
        try {
          // 创建表单数据用于POST请求
          const formData = new FormData();
          formData.append('app_key', emailData.app_key);
          formData.append('template_id', emailData.template_id);
          formData.append('to', emailData.to);
          formData.append('reply_to', emailData.reply_to);
          formData.append('alias', emailData.alias);
          formData.append('data', JSON.stringify(emailData.data));
          formData.append('callback', callbackName);
          
          // 创建XHR请求（支持跨域）
          const xhr = new XMLHttpRequest();
          xhr.open('POST', this.apiEndpoint, true);
          xhr.withCredentials = false; // 不发送凭证
          
          xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                window[callbackName](response);
              } catch (e) {
                // 如果响应不是JSON，可能是JSONP回调已经处理了
                // console.log('XHR响应不是JSON格式，可能已被JSONP处理', xhr.responseText);
              }
            } else {
              // 如果是开发环境，模拟成功
              if (isDevEnvironment) {
                window[callbackName]({
                  code: 200,
                  message: "邮件已发送(开发环境XHR模拟)"
                });
              } else {
                reject(new Error(`HTTP错误: ${xhr.status}`));
              }
            }
          };
          
          xhr.onerror = function() {
            // 在XHR失败时（可能是CORS问题），尝试JSONP方式
            // console.log('XHR请求失败，尝试JSONP方式');
            
            // 创建脚本标签进行JSONP请求
            const script = document.createElement('script');
            script.id = 'aoksend_script';
            
            // 构建URL查询参数
            const params = new URLSearchParams();
            for (let key in emailData) {
              if (key === 'data') {
                params.append(key, JSON.stringify(emailData[key]));
              } else {
                params.append(key, emailData[key]);
              }
            }
            params.append('callback', callbackName);
            
            // 设置脚本src并添加到文档
            script.src = `${this.apiEndpoint}?${params.toString()}`;
            document.head.appendChild(script);
            
            // 设置超时处理
            setTimeout(() => {
              if (window[callbackName]) {
                // 如果回调未被调用，说明JSONP也失败了
                if (isDevEnvironment) {
                  window[callbackName]({
                    code: 200,
                    message: "邮件已发送(开发环境JSONP超时模拟)"
                  });
                } else {
                  reject(new Error('JSONP请求超时'));
                }
              }
            }, 10000); // 10秒超时
          };
          
          // 发送XHR请求
          xhr.send(formData);
        } catch (e) {
          console.error('请求发送失败:', e);
          // 在开发环境中模拟成功响应
          if (isDevEnvironment) {
            window[callbackName]({
              code: 200,
              message: "邮件已发送(开发环境异常模拟)"
            });
          } else {
            reject(e);
          }
        }
      });
      
    } catch (error) {
      console.error('邮件发送失败:', error);
      
      // 如果是开发环境，返回模拟成功以便测试UI流程
      if (window.location.hostname === '127.0.0.1' || 
          window.location.hostname === 'localhost' ||
          window.location.hostname.includes('192.168.') ||
          window.location.protocol === 'file:') {
        // console.log('开发环境: 模拟成功响应');
        return {
          code: 200,
          message: "邮件发送已模拟成功"
        };
      }
      
      throw error;
    }
  }
}

// 导出单例实例
const feedbackSender = new FeedbackSender();
export default feedbackSender; 