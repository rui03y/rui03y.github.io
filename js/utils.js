class Utils {
    static copyToClipboard(text) {
        return navigator.clipboard.writeText(text)
            .then(() => {
                this.showToast('复制成功！');
                return true;
            })
            .catch(err => {
                console.error('复制失败:', err);
                this.showToast('复制失败，请重试');
                return false;
            });
    }

    static validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

class HistoryManager {
    static STORAGE_KEY = 'linkHistory';
    static MAX_HISTORY = 10;

    static save(link) {
        const history = this.get();
        history.unshift({
            url: link,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(history.slice(0, this.MAX_HISTORY))
        );
    }

    static get() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    static clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

class LoadingManager {
    static show() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loading);
    }

    static hide() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }
}

class ThemeManager {
    static THEME_KEY = 'preferredTheme';
    
    static init() {
        const savedTheme = localStorage.getItem(this.THEME_KEY) || 'light';
        this.setTheme(savedTheme);
        
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }
    
    static setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.THEME_KEY, theme);
    }
} 