import UIComponent from './UIComponent.js';

export default class CryptoWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Криптовалюты'
        });
        this.cryptoData = null;
        this.selectedCryptos = config.cryptos || ['bitcoin', 'ethereum', 'cardano', 'solana'];
    }
    
    render() {
        super.render();
        this.renderContent();
        this.fetchCryptoData();
        return this.element;
    }
    
    renderContent() {
        this.contentElement.innerHTML = `
            <div class="crypto-container">
                <div class="crypto-selector">
                    <select class="crypto-select" multiple>
                        <option value="bitcoin" ${this.selectedCryptos.includes('bitcoin') ? 'selected' : ''}>Bitcoin (BTC)</option>
                        <option value="ethereum" ${this.selectedCryptos.includes('ethereum') ? 'selected' : ''}>Ethereum (ETH)</option>
                        <option value="cardano" ${this.selectedCryptos.includes('cardano') ? 'selected' : ''}>Cardano (ADA)</option>
                        <option value="solana" ${this.selectedCryptos.includes('solana') ? 'selected' : ''}>Solana (SOL)</option>
                        <option value="ripple" ${this.selectedCryptos.includes('ripple') ? 'selected' : ''}>Ripple (XRP)</option>
                        <option value="polkadot" ${this.selectedCryptos.includes('polkadot') ? 'selected' : ''}>Polkadot (DOT)</option>
                        <option value="dogecoin" ${this.selectedCryptos.includes('dogecoin') ? 'selected' : ''}>Dogecoin (DOGE)</option>
                        <option value="matic-network" ${this.selectedCryptos.includes('matic-network') ? 'selected' : ''}>Polygon (MATIC)</option>
                    </select>
                    <button class="btn-apply">Применить</button>
                </div>
                <div class="crypto-loading">Загрузка данных о криптовалютах...</div>
                <div class="crypto-data" style="display: none;">
                    <div class="crypto-list"></div>
                </div>
                <button class="btn-refresh">Обновить</button>
            </div>
        `;
        
        this.cryptoLoading = this.contentElement.querySelector('.crypto-loading');
        this.cryptoData = this.contentElement.querySelector('.crypto-data');
        this.cryptoList = this.contentElement.querySelector('.crypto-list');
        this.cryptoSelect = this.contentElement.querySelector('.crypto-select');
        this.applyButton = this.contentElement.querySelector('.btn-apply');
        this.refreshButton = this.contentElement.querySelector('.btn-refresh');
        
        this.applyButton.addEventListener('click', () => this.updateSelectedCryptos());
        this.refreshButton.addEventListener('click', () => this.fetchCryptoData());
    }
    
    updateSelectedCryptos() {
        this.selectedCryptos = Array.from(this.cryptoSelect.selectedOptions).map(option => option.value);
        this.fetchCryptoData();
    }
    
    async fetchCryptoData() {
        try {
            this.cryptoLoading.style.display = 'block';
            this.cryptoData.style.display = 'none';
            
            if (this.selectedCryptos.length === 0) {
                this.cryptoLoading.textContent = 'Выберите криптовалюты';
                return;
            }
            
            // Используем реальный API CoinGecko
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${this.selectedCryptos.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
            );
            
            if (!response.ok) {
                throw new Error('Ошибка получения данных');
            }
            
            const data = await response.json();
            this.displayCryptoData(data);
        } catch (error) {
            console.error('Ошибка получения данных о криптовалютах:', error);
            this.cryptoLoading.textContent = 'Ошибка загрузки данных';
            this.cryptoData.style.display = 'none';
        }
    }
    
    displayCryptoData(data) {
        this.cryptoLoading.style.display = 'none';
        this.cryptoData.style.display = 'block';
        
        this.cryptoList.innerHTML = '';
        
        data.forEach(crypto => {
            const cryptoItem = document.createElement('div');
            cryptoItem.className = 'crypto-item';
            
            const change = crypto.price_change_percentage_24h || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeSymbol = change >= 0 ? '↗' : '↘';
            
            cryptoItem.innerHTML = `
                <div class="crypto-info">
                    <img src="${crypto.image}" alt="${crypto.name}" class="crypto-icon">
                    <div class="crypto-name">
                        <div class="crypto-fullname">${crypto.name}</div>
                        <div class="crypto-symbol">${crypto.symbol.toUpperCase()}</div>
                    </div>
                </div>
                <div class="crypto-price">$${crypto.current_price.toLocaleString('en-US', { maximumFractionDigits: 6 })}</div>
                <div class="crypto-change ${changeClass}">
                    ${changeSymbol} ${Math.abs(change).toFixed(2)}%
                </div>
            `;
            
            this.cryptoList.appendChild(cryptoItem);
        });
    }
    
    update() {
        this.fetchCryptoData();
    }
}