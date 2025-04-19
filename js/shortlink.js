class ShortlinkGenerator {
    constructor() {
        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.popupUrlInput = document.getElementById('popup-url-input');
        this.popupResult = document.getElementById('popup-result');
        this.copyAdnameBtn = document.getElementById('copy-adname-btn');
        this.previewIframe = document.getElementById('preview-iframe');
    }

    bindEvents() {
        document.getElementById('open-popup').addEventListener('click', (e) => this.handlePopupOpen(e));
        document.getElementById('close-popup').addEventListener('click', () => this.handlePopupClose());
        this.copyAdnameBtn.addEventListener('click', () => this.copyAdname());
    }

    async handlePopupOpen(e) {
        e.preventDefault();
        LoadingManager.show();

        try {
            const isLoggedIn = await this.checkLoginStatus();
            if (isLoggedIn) {
                document.getElementById('side-popup').style.display = 'block';
            } else {
                Utils.showToast('请先登录 ant.bigo.sg');
            }
        } catch (error) {
            console.error('检查登录状态时发生错误:', error);
            Utils.showToast('无法验证登录状态，请重试');
        } finally {
            LoadingManager.hide();
        }
    }

    handlePopupClose() {
        document.getElementById('side-popup').style.display = 'none';
    }

    async checkLoginStatus() {
        return new Promise((resolve) => {
            const iframe = document.getElementById('login-check-frame');
            iframe.src = 'https://ant.bigo.sg/p/welcome?appId=60';
            
            const timeout = setTimeout(() => {
                resolve(false);
            }, 3000);

            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentWindow.document;
                    const logoImg = iframeDoc.querySelector('img.logo-img');
                    clearTimeout(timeout);
                    resolve(!!logoImg);
                } catch {
                    clearTimeout(timeout);
                    resolve(false);
                }
            };
        });
    }

    async generateShortlink() {
        const url = this.popupUrlInput.value.trim();
        if (!url) {
            Utils.showToast('请输入原始链接');
            return;
        }

        if (!Utils.validateURL(url)) {
            Utils.showToast('请输入有效的链接');
            return;
        }

        LoadingManager.show();

        try {
            const response = await fetch('https://shortlink.bigotopr.asia/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (data.shortlink) {
                this.displayResult(data.shortlink);
                this.updatePreview(data.shortlink);
                HistoryManager.save(data.shortlink);
            } else {
                Utils.showToast(`生成失败：${data.error || '未知错误'}`);
            }
        } catch (error) {
            console.error('生成短链时发生错误:', error);
            Utils.showToast('请求失败，请重试');
        } finally {
            LoadingManager.hide();
        }
    }

    displayResult(shortlink) {
        const match = shortlink.match(/slink\.bigovideo\.tv\/([A-Za-z0-9]+)/);
        const shortcode = match && match[1] ? match[1] : '';

        const formattedShortlink = `✅ 短链：<a href="${shortlink}" target="_blank">${shortlink}</a>`;
        const formattedAdname = `📣 广告信息拼接用：<span style="font-weight:bold;">__${shortcode}__</span>`;

        this.popupResult.innerHTML = `${formattedShortlink}<br>${formattedAdname}`;
        this.copyAdnameBtn.style.display = 'inline-block';
    }

    copyAdname() {
        const popupResult = this.popupResult.innerHTML;
        const match = popupResult.match(/https:\/\/slink\.bigovideo\.tv\/([A-Za-z0-9]{6})/);
        
        if (match && match[1]) {
            const shortcode = match[1];
            const formattedAdname = `__${shortcode}__`;
            Utils.copyToClipboard(formattedAdname);
        } else {
            Utils.showToast('未能从短链中提取到正确的短码');
        }
    }

    updatePreview(url) {
        this.previewIframe.src = url;
    }
} 