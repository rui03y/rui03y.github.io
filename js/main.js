document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题管理器
    ThemeManager.init();
    
    // 初始化 Deeplink 转换器
    const deeplinkConverter = new DeeplinkConverter();
    
    // 初始化短链生成器
    const shortlinkGenerator = new ShortlinkGenerator();
    
    // 初始化历史记录显示
    initHistoryDisplay();
});

function initHistoryDisplay() {
    const history = HistoryManager.get();
    if (history.length > 0) {
        const historyContainer = document.createElement('div');
        historyContainer.className = 'history-container';
        historyContainer.innerHTML = '<h3>历史记录</h3>';
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = item.url;
            historyItem.addEventListener('click', () => {
                document.getElementById('url-input').value = item.url;
            });
            historyContainer.appendChild(historyItem);
        });
        
        document.querySelector('.form-container').appendChild(historyContainer);
    }
} 