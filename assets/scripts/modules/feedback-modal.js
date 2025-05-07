// 导入反馈发送器
import feedbackSender from './feedback-sender.js';

class FeedbackModal {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.className = 'feedback-modal';
        this.modal.innerHTML = `
      <div class="feedback-content">
        <div class="feedback-header">
          <h3>邮箱反馈</h3>
          <button class="close-feedback">&times;</button>
        </div>
        <form id="feedback-form">
          <div class="form-group">
            <label for="feedback-email" class="required">您的邮箱</label>
            <div class="email-input-container">
              <input type="email" id="feedback-email" required placeholder="请输入邮箱">
              <div class="email-suffix-wrapper">
                <select class="email-suffix-select">
                    <!-- 国际通用邮箱后缀 -->
                    <option value="@gmail.com">@gmail.com</option>
                    <option value="@outlook.com">@outlook.com</option>
                    <option value="@hotmail.com">@hotmail.com</option>

                    <!-- 中国常用邮箱后缀 -->
                    <option value="@qq.com">@qq.com</option>
                    <option value="@163.com">@163.com</option>
                    <option value="@126.com">@126.com</option>
                    <option value="@139.com">@139.com</option>

                    <!-- 国际通用邮箱后缀 -->
                    <option value="@yahoo.com">@yahoo.com</option>
                    <option value="@icloud.com">@icloud.com</option>

                    <!-- 美国常用邮箱后缀 -->
                    <option value="@aol.com">@aol.com</option>
                    <option value="@netzero.net">@netzero.net</option>
                    <option value="@comcast.net">@comcast.net</option>
                    <option value="@verizon.net">@verizon.net</option>

                    <!-- 其他国家和地区 -->
                    <option value="@t-online.de">@t-online.de</option> <!-- 德国 -->
                    <option value="@btinternet.com">@btinternet.com</option> <!-- 英国 -->
                    <option value="@yahoo.co.jp">@yahoo.co.jp</option> <!-- 日本 -->
                    <option value="@candel.co.jp">@candel.co.jp</option> <!-- 日本 -->
                    <option value="@rediffmail.com">@rediffmail.com</option> <!-- 印度 -->
                    <option value="@vsnl.com">@vsnl.com</option> <!-- 印度 -->
                    <option value="@yandex.ru">@yandex.ru</option> <!-- 俄罗斯 -->
                    <option value="@mail.ru">@mail.ru</option> <!-- 俄罗斯 -->
                    <option value="@wannado.fr">@wannado.fr</option> <!-- 法国 -->
                    <option value="@excite.com">@excite.com</option> <!-- 法国 -->
                    <option value="@bigpond.com">@bigpond.com</option> <!-- 澳大利亚 -->
                    <option value="@westnet.com.au">@westnet.com.au</option> <!-- 澳大利亚 -->
                    <option value="@ig.com.br">@ig.com.br</option> <!-- 巴西 -->
                    <option value="@uol.com.br">@uol.com.br</option> <!-- 巴西 -->
                    <option value="@amet.com.ar">@amet.com.ar</option> <!-- 阿根廷 -->
                    <option value="@infovia.com.ar">@infovia.com.ar</option> <!-- 阿根廷 -->
                    <option value="@naver.com">@naver.com</option> <!-- 韩国 -->
                    <option value="@daum.net">@daum.net</option> <!-- 韩国 -->
                    <option value="@emirates.net.ae">@emirates.net.ae</option> <!-- 阿联酋 -->
                    <option value="@zahav.net.il">@zahav.net.il</option> <!-- 以色列 -->
                    <option value="@pacific.net.sg">@pacific.net.sg</option> <!-- 新加坡 -->
                    <option value="@hn.vnn.vn">@hn.vnn.vn</option> <!-- 越南 -->
                </select>
              </div>
            </div>
            <div class="form-error-message">请输入有效的邮箱地址</div>
          </div>
          <div class="form-group">
            <label for="feedback-subject" class="required">标题</label>
            <input type="text" id="feedback-subject" required placeholder="请输入标题">
            <div class="form-error-message">请输入标题内容</div>
          </div>
          <div class="form-group">
            <label for="feedback-message" class="required">内容</label>
            <textarea id="feedback-message" rows="5" required placeholder="请输入内容..."></textarea>
            <div class="form-error-message">请输入反馈内容</div>
          </div>
          <div class="form-required-hint">
            <span>*</span>为必填项
          </div>
          <div class="feedback-actions">
            <button type="button" class="cancel-feedback">取消</button>
            <button type="submit" class="submit-feedback">发送</button>
          </div>
        </form>
      </div>
    `;

        document.body.appendChild(this.modal);

        // 初始状态下隐藏模态框
        this.modal.style.display = 'none';
        // 确保不自动显示
        this.close();

        this.setupEventListeners();
        
        // 添加全局错误处理，确保页面滚动功能可以恢复
        this.setupGlobalErrorHandling();
    }

    setupEventListeners() {
        const closeBtn = this.modal.querySelector('.close-feedback');
        const cancelBtn = this.modal.querySelector('.cancel-feedback');

        closeBtn.addEventListener('click', () => {
            // 关闭前重置表单
            this.resetForm();
            this.close();
        });
        
        cancelBtn.addEventListener('click', () => {
            // 取消前重置表单
            this.resetForm();
            this.close();
        });

        // 邮箱输入处理
        const emailInput = this.modal.querySelector('#feedback-email');
        const suffixSelect = this.modal.querySelector('.email-suffix-select');
        const suffixWrapper = this.modal.querySelector('.email-suffix-wrapper');
        const emailForm = this.modal.querySelector('#feedback-form');
        const subjectInput = this.modal.querySelector('#feedback-subject');
        const messageInput = this.modal.querySelector('#feedback-message');
        const submitBtn = this.modal.querySelector('.submit-feedback');

        // 创建一个隐藏的输入框存储完整邮箱
        const hiddenEmailInput = document.createElement('input');
        hiddenEmailInput.type = 'hidden';
        hiddenEmailInput.id = 'full-email-hidden';
        hiddenEmailInput.name = 'email';

        // 将隐藏输入框添加到表单
        emailForm.appendChild(hiddenEmailInput);

        // 监听表单提交，确保原始邮箱输入框也有required属性，但类型改为text
        emailInput.type = 'text';
        emailInput.setAttribute('required', 'required');

        // 初始化时确保第一个选项被选中
        suffixSelect.selectedIndex = 0;
        const defaultSuffix = suffixSelect.options[0].value;
        suffixSelect.value = defaultSuffix;
        suffixWrapper.setAttribute('data-suffix', defaultSuffix);
        this.updateFullEmail(emailInput, suffixSelect, hiddenEmailInput);

        // 实时验证
        emailInput.addEventListener('input', () => {
            this.updateFullEmail(emailInput, suffixSelect, hiddenEmailInput);
            this.validateField(emailInput, '请输入有效的邮箱地址');
        });

        emailInput.addEventListener('blur', () => {
            this.validateField(emailInput, '请输入有效的邮箱地址');
        });

        subjectInput.addEventListener('input', () => {
            this.validateField(subjectInput, '请输入标题内容');
        });

        subjectInput.addEventListener('blur', () => {
            this.validateField(subjectInput, '请输入标题内容');
        });

        messageInput.addEventListener('input', () => {
            this.validateField(messageInput, '请输入反馈内容');
        });

        messageInput.addEventListener('blur', () => {
            this.validateField(messageInput, '请输入反馈内容');
        });

        // 监听后缀选择变化
        suffixSelect.addEventListener('change', () => {
            // 确保选中值正确
            const selectedValue = suffixSelect.value;
            
            // 更新显示的后缀文本
            suffixWrapper.setAttribute('data-suffix', selectedValue);

            // 从邮箱输入框中移除所有后缀部分
            if (emailInput.value.includes('@')) {
                emailInput.value = emailInput.value.split('@')[0];
            }

            this.updateFullEmail(emailInput, suffixSelect, hiddenEmailInput);
            this.validateField(emailInput, '请输入有效的邮箱地址');
        });

        // 表单提交验证
        emailForm.addEventListener('submit', (e) => {
            // 阻止默认提交行为
            e.preventDefault();

            // 显示加载状态
            this.setLoading(true);

            // 验证所有字段
            const isEmailValid = this.validateField(emailInput, '请输入有效的邮箱地址');
            const isSubjectValid = this.validateField(subjectInput, '请输入标题内容');
            const isMessageValid = this.validateField(messageInput, '请输入反馈内容');

            // 如果所有字段都有效，提交表单
            if (isEmailValid && isSubjectValid && isMessageValid) {
                this.handleSubmit(e);
            } else {
                this.setLoading(false);
            }
        });
    }

    // 更新完整邮箱的方法
    updateFullEmail(emailInput, suffixSelect, hiddenInput) {
        // 从原始输入框获取前缀
        let prefix = emailInput.value;

        // 移除可能存在的后缀部分
        if (prefix.includes('@')) {
            prefix = prefix.split('@')[0];
        }

        // 确保获取选中的后缀值
        const suffix = suffixSelect.value;

        // 组合完整邮箱地址
        const fullEmail = prefix + suffix;

        // 更新隐藏输入框
        hiddenInput.value = fullEmail;

        // 实时验证邮箱格式
        this.validateField(emailInput, '请输入有效的邮箱地址');
    }

    // 设置加载状态
    setLoading(isLoading) {
        const submitBtn = this.modal.querySelector('.submit-feedback');
        if (isLoading) {
            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
        } else {
            submitBtn.textContent = '发送';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    // 添加表单重置方法
    resetForm() {
        // 重置邮箱输入框
        const emailInput = this.modal.querySelector('#feedback-email');
        if (emailInput) emailInput.value = '';
        
        // 重置标题输入框
        const subjectInput = this.modal.querySelector('#feedback-subject');
        if (subjectInput) subjectInput.value = '';
        
        // 重置内容输入框
        const messageInput = this.modal.querySelector('#feedback-message');
        if (messageInput) messageInput.value = '';
        
        // 重置后缀选择框为默认值
        const suffixSelect = this.modal.querySelector('.email-suffix-select');
        const suffixWrapper = this.modal.querySelector('.email-suffix-wrapper');
        if (suffixSelect) {
            suffixSelect.selectedIndex = 0;
            const defaultSuffix = suffixSelect.options[0].value;
            suffixSelect.value = defaultSuffix;
            if (suffixWrapper) {
                suffixWrapper.setAttribute('data-suffix', defaultSuffix);
            }
        }
        
        // 重置隐藏的邮箱字段
        const hiddenEmail = document.getElementById('full-email-hidden');
        if (hiddenEmail) hiddenEmail.value = '';
        
        // 重置所有字段的验证状态
        const formGroups = this.modal.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('has-error', 'has-success');
        });
        
        // 重置提交按钮状态
        const submitBtn = this.modal.querySelector('.submit-feedback');
        if (submitBtn) {
            submitBtn.textContent = '发送';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // 获取表单数据
        const emailInput = document.getElementById('feedback-email');
        const hiddenEmail = document.getElementById('full-email-hidden');
        const fullEmail = hiddenEmail.value; // 从隐藏字段获取完整邮箱
        const subject = document.getElementById('feedback-subject').value;
        const message = document.getElementById('feedback-message').value;

        try {
            // 使用反馈发送器发送邮件
            const result = await feedbackSender.sendFeedback({
                userEmail: fullEmail,
                subject: subject,
                content: message
            });
            
            // 打印日志
            // console.log(`邮件发送结果:`, result);
            
            // 根据结果显示成功或失败提示
            if (result.success) {
                // 重置表单
                this.resetForm();
                
                // 发送成功，关闭反馈弹窗，防止重复发送
                this.close();
                
                // 显示成功消息
                this.showSuccessMessage();
            } else {
                // 检查是否为频率限制错误
                if (result.error === 'rate_limit_exceeded') {
                    // 显示频率限制错误，但不关闭窗口以便用户了解情况
                    this.showRateLimitError(result.message);
                } else {
                    // 重置表单
                    this.resetForm();
                    
                    // 其他错误，关闭反馈弹窗
                    this.close();
                    
                    // 显示用户友好的错误提示
                    let errorMessage = result.message || '发送失败，请稍后重试';
                    
                    // 针对邮箱错误提供更友好的提示
                    if (errorMessage.includes('reply_to') || 
                        errorMessage.includes('邮箱') || 
                        errorMessage.toLowerCase().includes('email')) {
                        errorMessage = '邮箱格式填写不正确，请检查后重试';
                    }
                    
                    this.showErrorMessage(errorMessage);
                }
            }
        } catch (error) {
            console.error('邮件发送失败:', error);
            
            // 重置表单
            this.resetForm();
            
            // 发送失败也关闭反馈弹窗
            this.close();
            
            // 处理错误提示
            let errorMessage = '发送失败，请稍后重试';
            if (error.message && (
                error.message.includes('reply_to') || 
                error.message.includes('邮箱') || 
                error.message.toLowerCase().includes('email'))) {
                errorMessage = '邮箱格式填写不正确，请检查后重试';
            }
            
            this.showErrorMessage(errorMessage);
        } finally {
            // 无论如何，都要移除加载状态
            this.setLoading(false);
        }
    }
    
    // 显示频率限制错误，在表单内显示
    showRateLimitError(message) {
        // 创建警告元素
        const warningElement = document.createElement('div');
        warningElement.className = 'rate-limit-warning';
        warningElement.innerHTML = `
            <div class="warning-icon">⚠️</div>
            <p>${message}</p>
        `;
        
        // 添加样式
        warningElement.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
        warningElement.style.border = '1px solid #ffc107';
        warningElement.style.borderRadius = '8px';
        warningElement.style.padding = '10px 15px';
        warningElement.style.marginBottom = '15px';
        warningElement.style.color = '#e6a700';
        warningElement.style.display = 'flex';
        warningElement.style.alignItems = 'center';
        
        // 给图标添加样式
        const warningIcon = warningElement.querySelector('.warning-icon');
        warningIcon.style.marginRight = '10px';
        warningIcon.style.fontSize = '20px';
        
        // 获取表单内容区域
        const formContent = this.modal.querySelector('.feedback-content');
        const form = this.modal.querySelector('#feedback-form');
        
        // 移除可能存在的旧警告
        const oldWarning = formContent.querySelector('.rate-limit-warning');
        if (oldWarning) {
            formContent.removeChild(oldWarning);
        }
        
        // 插入到表单前面
        formContent.insertBefore(warningElement, form);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (formContent.contains(warningElement)) {
                formContent.removeChild(warningElement);
            }
        }, 5000);
    }

    // 显示错误消息
    showErrorMessage(message) {
        // 先创建错误提示，再创建遮罩层，确保顺序正确
        const errorMessage = document.createElement('div');
        errorMessage.className = 'feedback-error-message';
        errorMessage.innerHTML = `
            <div class="feedback-error-icon"></div>
            <h3 class="feedback-error-title">发送失败</h3>
            <p class="feedback-error-text">${message}</p>
            <button class="feedback-error-button">确定</button>
        `;

        // 创建遮罩层
        const backdrop = this.createBackdrop();
        
        // 确保页面不能滚动
        document.body.classList.add('modal-open');
        document.body.classList.remove('modal-closed');
        
        // 确保遮罩层完全显示后再显示消息
        setTimeout(() => {
            // 添加到页面
            document.body.appendChild(errorMessage);
            
            // 触发动画
            setTimeout(() => {
                errorMessage.classList.add('active');
            }, 10);
        }, 100);

        // 处理确定按钮点击事件
        const confirmButton = errorMessage.querySelector('.feedback-error-button');
        confirmButton.addEventListener('click', () => {
            // 添加移除动画
            errorMessage.classList.remove('active');
            errorMessage.classList.add('exit');
            
            // 移除遮罩层和提示
            setTimeout(() => {
                if (document.body.contains(errorMessage)) {
                    document.body.removeChild(errorMessage);
                }
                this.removeBackdrop();
                
                // 确保页面可以滚动
                document.body.classList.remove('modal-open');
                document.body.classList.add('modal-closed');
            }, 300);
        });

        // 自动关闭（5秒后）
        const autoCloseTimeout = setTimeout(() => {
            if (document.body.contains(errorMessage)) {
                // 添加移除动画
                errorMessage.classList.remove('active');
                errorMessage.classList.add('exit');
                
                // 延迟后移除元素
                setTimeout(() => {
                    if (document.body.contains(errorMessage)) {
                        document.body.removeChild(errorMessage);
                    }
                    this.removeBackdrop();
                    
                    // 确保页面可以滚动
                    document.body.classList.remove('modal-open');
                    document.body.classList.add('modal-closed');
                }, 300);
            }
        }, 5000);
        
        // 点击确定按钮时清除自动关闭的计时器
        confirmButton.addEventListener('click', () => {
            clearTimeout(autoCloseTimeout);
        });
    }

    // 显示成功提示消息
    showSuccessMessage() {
        // 先创建成功提示，再创建遮罩层，确保顺序正确
        const successMessage = document.createElement('div');
        successMessage.className = 'feedback-success-message';
        successMessage.innerHTML = `
            <div class="feedback-success-icon"></div>
            <h3 class="feedback-success-title">发送成功</h3>
            <p class="feedback-success-text">感谢您的反馈，我们将尽快处理您的意见！</p>
            <button class="feedback-success-button">确定</button>
        `;
        
        // 创建遮罩层
        const backdrop = this.createBackdrop();
        
        // 确保页面不能滚动
        document.body.classList.add('modal-open');
        document.body.classList.remove('modal-closed');
        
        // 确保遮罩层完全显示后再显示消息
        setTimeout(() => {
            // 添加到页面
            document.body.appendChild(successMessage);
            
            // 触发动画
            setTimeout(() => {
                successMessage.classList.add('active');
            }, 10);
        }, 100);

        // 处理确定按钮点击事件
        const confirmButton = successMessage.querySelector('.feedback-success-button');
        confirmButton.addEventListener('click', () => {
            // 添加移除动画
            successMessage.classList.remove('active');
            successMessage.classList.add('exit');
            
            // 延迟后移除元素
            setTimeout(() => {
                if (document.body.contains(successMessage)) {
                    document.body.removeChild(successMessage);
                }
                this.removeBackdrop();
                
                // 确保页面可以滚动
                document.body.classList.remove('modal-open');
                document.body.classList.add('modal-closed');
            }, 300);
        });

        // 自动关闭（5秒后）
        const autoCloseTimeout = setTimeout(() => {
            if (document.body.contains(successMessage)) {
                // 添加移除动画
                successMessage.classList.remove('active');
                successMessage.classList.add('exit');
                
                // 延迟后移除元素
                setTimeout(() => {
                    if (document.body.contains(successMessage)) {
                        document.body.removeChild(successMessage);
                    }
                    this.removeBackdrop();
                    
                    // 确保页面可以滚动
                    document.body.classList.remove('modal-open');
                    document.body.classList.add('modal-closed');
                }, 300);
            }
        }, 5000);
        
        // 点击确定按钮时清除自动关闭的计时器
        confirmButton.addEventListener('click', () => {
            clearTimeout(autoCloseTimeout);
        });
    }
    
    // 创建背景遮罩层
    createBackdrop() {
        // 检查是否已存在遮罩层
        let backdrop = document.querySelector('.modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop';
            document.body.appendChild(backdrop);
        }
        
        // 显示遮罩层
        backdrop.style.display = 'block';
        
        // 禁用页面滚动
        document.body.classList.add('modal-open');
        document.body.classList.remove('modal-closed');
        
        // 强制回流后添加显示类
        setTimeout(() => {
            backdrop.classList.add('show');
        }, 10);
        
        return backdrop;
    }
    
    // 移除背景遮罩层
    removeBackdrop() {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            // 移除显示类，触发淡出效果
            backdrop.classList.remove('show');
            
            // 恢复页面滚动
            document.body.classList.remove('modal-open');
            document.body.classList.add('modal-closed');
            
            // 完全移除元素
            setTimeout(() => {
                if (document.body.contains(backdrop)) {
                    document.body.removeChild(backdrop);
                }
                
                // 再次确保页面可以滚动
                document.body.classList.remove('modal-open');
                document.body.classList.add('modal-closed');
            }, 300);
        }
    }

    open() {
        this.modal.style.display = 'flex';
        this.createBackdrop();
        // 禁用背景滚动
        document.body.classList.add('modal-open');
        document.body.classList.remove('modal-closed');
    }

    close() {
        // 先重置表单再关闭
        this.resetForm();
        
        // 关闭模态框
        this.modal.style.display = 'none';
        this.removeBackdrop();
        
        // 恢复背景滚动
        document.body.classList.remove('modal-open');
        document.body.classList.add('modal-closed');
        
        // 确保页面可以滚动
        setTimeout(() => {
            document.body.classList.remove('modal-open');
            document.body.classList.add('modal-closed');
        }, 10);
    }

    // 字段验证方法
    validateField(field, errorMessage) {
        // 获取字段所在的表单组
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error-message');

        // 邮箱特殊处理
        if (field.id === 'feedback-email') {
            // 获取完整邮箱（包含后缀）
            const hiddenEmail = document.getElementById('full-email-hidden');
            const fullEmail = hiddenEmail ? hiddenEmail.value : field.value;

            // 检查邮箱是否为空
            if (!field.value.trim().length) {
                formGroup.classList.add('has-error');
                formGroup.classList.remove('has-success');
                errorElement.textContent = '请输入邮箱地址';
                return false;
            }

            // 检查完整邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValidFormat = emailRegex.test(fullEmail);

            if (!isValidFormat) {
                formGroup.classList.add('has-error');
                formGroup.classList.remove('has-success');
                errorElement.textContent = '邮箱格式不正确，请检查';
                return false;
            }

            // 邮箱格式正确
            formGroup.classList.remove('has-error');
            formGroup.classList.add('has-success');
            return true;
        }
        // 常规字段验证
        else {
            if (!field.value.trim()) {
                formGroup.classList.add('has-error');
                formGroup.classList.remove('has-success');
                errorElement.textContent = errorMessage;
                return false;
            } else {
                formGroup.classList.remove('has-error');
                formGroup.classList.add('has-success');
                return true;
            }
        }
    }

    // 添加全局错误处理
    setupGlobalErrorHandling() {
        // 为ESC键添加事件监听，按ESC键关闭所有模态框并恢复滚动
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                // ESC键重置表单并强制恢复滚动
                this.resetForm();
                this.forceRestoreScroll();
            }
        });
        
        // 如果用户点击了页面其他区域也恢复滚动
        document.addEventListener('click', (e) => {
            const isModalOpen = document.querySelector('.modal-backdrop') !== null;
            if (isModalOpen) {
                const clickedOnBackdrop = e.target.classList.contains('modal-backdrop');
                if (clickedOnBackdrop) {
                    // 点击背景也重置表单
                    this.resetForm();
                    this.forceRestoreScroll();
                }
            }
        });
        
        // 为页面添加加载和卸载事件，确保滚动功能能够恢复
        window.addEventListener('load', () => this.forceRestoreScroll());
        window.addEventListener('beforeunload', () => this.forceRestoreScroll());
    }
    
    // 强制恢复页面滚动功能
    forceRestoreScroll() {
        // 移除所有可能存在的模态框和遮罩
        const successMessage = document.querySelector('.feedback-success-message');
        if (successMessage && document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
        }
        
        const errorMessage = document.querySelector('.feedback-error-message');
        if (errorMessage && document.body.contains(errorMessage)) {
            document.body.removeChild(errorMessage);
        }
        
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop && document.body.contains(backdrop)) {
            document.body.removeChild(backdrop);
        }
        
        // 强制恢复滚动
        document.body.classList.remove('modal-open');
        document.body.classList.add('modal-closed');
        document.body.style.overflow = '';
        
        // 确保模态框关闭
        this.modal.style.display = 'none';
        
        // 重置表单
        this.resetForm();
    }
}

// 创建并导出反馈表单的单例实例
const feedbackModal = new FeedbackModal();
export default feedbackModal;