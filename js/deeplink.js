class DeeplinkConverter {
    constructor() {
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.urlInput = document.getElementById('url-input');
        this.outputBox = document.getElementById('output-box');
        this.previewIframe = document.getElementById('preview-iframe');
        this.alertMessage = document.getElementById('alert-message');
        this.copyButton = document.querySelector('.copy-button');
    }

    bindEvents() {
        document.querySelector('.buttonen').addEventListener('click', () => this.encodeURL());
        document.querySelector('.buttonun').addEventListener('click', () => this.decodeURL());
        this.copyButton.addEventListener('click', () => this.copyOutput());
        
        // 使用防抖处理窗口大小调整
        window.addEventListener('resize', Utils.debounce(() => {
            this.adjustPreviewHeight();
        }, 250));
    }

    encodeURL() {
        const urlInput = this.urlInput.value.trim();
        if (!urlInput) {
            Utils.showToast('请输入链接');
            return;
        }

        if (!Utils.validateURL(urlInput) && !urlInput.startsWith('bigolive://')) {
            Utils.showToast('请输入有效的链接');
            return;
        }

        LoadingManager.show();
        
        let fullEncodedURL;
        if (urlInput.startsWith('bigolive://web?url=')) {
            fullEncodedURL = urlInput;
        } else {
            const encodedURL = encodeURIComponent(urlInput);
            fullEncodedURL = `bigolive://web?url=${encodedURL}`;
        }

        this.updateOutput(fullEncodedURL);
        this.updatePreview(fullEncodedURL);
        HistoryManager.save(fullEncodedURL);
        
        LoadingManager.hide();
    }

    decodeURL() {
        let urlInput = this.urlInput.value.trim();
        if (!urlInput) {
            Utils.showToast('请输入链接');
            return;
        }

        LoadingManager.show();

        if (urlInput.startsWith('bigolive://web?url=')) {
            urlInput = urlInput.replace('bigolive://web?url=', '');
        }
        
        try {
            const decodedURL = decodeURIComponent(urlInput);
            this.updateOutput(decodedURL);
            this.updatePreview(decodedURL);
            HistoryManager.save(decodedURL);
        } catch (error) {
            Utils.showToast('解码失败，请检查链接格式');
        }
        
        LoadingManager.hide();
    }

    updateOutput(text) {
        this.outputBox.textContent = text;
    }

    updatePreview(url) {
        let previewUrl = url;
        if (url.startsWith('bigolive://web?url=')) {
            previewUrl = decodeURIComponent(url.replace('bigolive://web?url=', ''));
        }
        this.previewIframe.src = previewUrl;
    }

    copyOutput() {
        const text = this.outputBox.textContent;
        Utils.copyToClipboard(text);
    }

    adjustPreviewHeight() {
        if (window.innerWidth < 768) {
            this.previewIframe.style.height = '45vh';
        } else {
            this.previewIframe.style.height = '70vh';
        }
    }
} 