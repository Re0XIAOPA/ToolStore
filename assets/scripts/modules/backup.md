## 机场特色功能部分（2025-04-27移除该部分）

```js
<div class="features-section">
    <div class="section-title">
        <svg viewBox="0 0 24 24">
            <path fill="#7c8aff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        特色功能
    </div>
    
    <div class="features-grid">
        ${details.features.map(feature => `
            <div class="feature-item">
                <div class="feature-header">
                    <div class="feature-icon">${feature.icon}</div>
                    <div class="feature-title"><h5>${feature.title}</h5></div>
                </div>
                <div class="feature-description"><p>${feature.description}</p></div>
            </div>
        `).join('')}
    </div>
</div>
```