import UIComponent from './UIComponent.js';

export default class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Погода'
        });
        this.city = config.city || 'Москва';
        this.weatherData = null;
        
        // Добавляем прокси URL для обхода CORS на GitHub Pages
        this.PROXY_URL = 'https://api.allorigins.win/raw?url=';
        // Альтернативные прокси, если первый не работает
        this.PROXY_OPTIONS = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest='
        ];
        this.currentProxyIndex = 0;
    }
    
    render() {
        super.render();
        this.renderContent();
        this.fetchWeatherData();
        return this.element;
    }
    
    renderContent() {
        this.contentElement.innerHTML = `
            <div class="weather-container">
                <div class="weather-input">
                    <input type="text" class="city-input" value="${this.city}" placeholder="Введите город">
                    <button class="btn-search">Поиск</button>
                </div>
                <div class="weather-loading">Загрузка данных о погоде...</div>
                <div class="weather-data" style="display: none;">
                    <div class="weather-city"></div>
                    <div class="weather-main">
                        <div class="weather-temp"></div>
                        <div class="weather-icon"></div>
                    </div>
                    <div class="weather-desc"></div>
                    <div class="weather-details">
                        <div class="weather-humidity">💧 <span></span>%</div>
                        <div class="weather-pressure">📊 <span></span> гПа</div>
                        <div class="weather-wind">💨 <span></span> м/с</div>
                        <div class="weather-feels-like">🤔 <span></span>°C</div>
                    </div>
                </div>
                <div class="weather-error" style="display: none;"></div>
                <div class="weather-proxy-info" style="display: none; font-size: 12px; color: #666; margin-top: 10px;"></div>
                <button class="btn-refresh">Обновить</button>
            </div>
        `;
        
        this.weatherLoading = this.contentElement.querySelector('.weather-loading');
        this.weatherData = this.contentElement.querySelector('.weather-data');
        this.weatherError = this.contentElement.querySelector('.weather-error');
        this.proxyInfo = this.contentElement.querySelector('.weather-proxy-info');
        this.weatherCity = this.contentElement.querySelector('.weather-city');
        this.weatherTemp = this.contentElement.querySelector('.weather-temp');
        this.weatherIcon = this.contentElement.querySelector('.weather-icon');
        this.weatherDesc = this.contentElement.querySelector('.weather-desc');
        this.weatherHumidity = this.contentElement.querySelector('.weather-humidity span');
        this.weatherPressure = this.contentElement.querySelector('.weather-pressure span');
        this.weatherWind = this.contentElement.querySelector('.weather-wind span');
        this.weatherFeelsLike = this.contentElement.querySelector('.weather-feels-like span');
        this.cityInput = this.contentElement.querySelector('.city-input');
        this.searchButton = this.contentElement.querySelector('.btn-search');
        this.refreshButton = this.contentElement.querySelector('.btn-refresh');
        
        this.searchButton.addEventListener('click', () => this.changeCity());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.changeCity();
        });
        this.refreshButton.addEventListener('click', () => this.fetchWeatherData());
    }
    
    changeCity() {
        const newCity = this.cityInput.value.trim();
        if (newCity && newCity !== this.city) {
            this.city = newCity;
            this.fetchWeatherData();
        }
    }
    
    async fetchWeatherData() {
        try {
            this.showLoading();
            
            // Пробуем несколько способов получения данных
            await this.tryFetchWeatherData();
            
        } catch (error) {
            console.error('Ошибка получения данных о погоде:', error);
            
            // Пробуем использовать другой прокси
            if (this.currentProxyIndex < this.PROXY_OPTIONS.length - 1) {
                this.currentProxyIndex++;
                this.proxyInfo.textContent = `Используется прокси #${this.currentProxyIndex + 1}...`;
                this.proxyInfo.style.display = 'block';
                setTimeout(() => this.fetchWeatherData(), 1000);
                return;
            }
            
            // Все прокси не сработали, показываем ошибку
            this.showError('Не удалось получить данные о погоде. Проверьте название города или попробуйте позже.');
        }
    }
    
    async tryFetchWeatherData() {
        const encodedCity = encodeURIComponent(this.city);
        const proxyUrl = this.PROXY_OPTIONS[this.currentProxyIndex];
        const targetUrl = `https://wttr.in/${encodedCity}?format=j1&lang=ru`;
        
        // Пробуем с прокси
        const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`, {
            headers: {
                'Accept': 'application/json',
            },
            timeout: 10000 // 10 секунд таймаут
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const text = await response.text();
        
        // Проверяем, что получили валидный JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // Если не JSON, возможно, это HTML страница с ошибкой
            throw new Error('Неверный формат ответа от сервера');
        }
        
        this.processWeatherData(data);
        
        // Показываем информацию о прокси
        this.proxyInfo.textContent = `Данные получены через прокси`;
        this.proxyInfo.style.display = 'block';
    }
    
    processWeatherData(data) {
        try {
            const current = data.current_condition[0];
            const area = data.nearest_area[0];
            
            this.weatherCity.textContent = `${area.areaName[0].value}, ${area.country[0].value}`;
            this.weatherTemp.textContent = `${current.temp_C}°C`;
            this.weatherDesc.textContent = current.lang_ru[0].value;
            this.weatherHumidity.textContent = current.humidity;
            this.weatherPressure.textContent = current.pressure;
            this.weatherWind.textContent = current.windspeedKmph;
            this.weatherFeelsLike.textContent = current.FeelsLikeC;
            
            // Создаем иконку погоды на основе описания
            this.createWeatherIcon(current.weatherDesc[0].value);
            
            this.showWeatherData();
            
        } catch (error) {
            console.error('Ошибка обработки данных:', error);
            throw new Error('Ошибка обработки данных погоды');
        }
    }
    
    createWeatherIcon(weatherDesc) {
        const desc = weatherDesc.toLowerCase();
        let icon = '☀️';
        
        if (desc.includes('дождь')) icon = '🌧️';
        else if (desc.includes('снег')) icon = '❄️';
        else if (desc.includes('облач')) icon = '⛅';
        else if (desc.includes('туман')) icon = '🌫️';
        else if (desc.includes('гроза')) icon = '⛈️';
        else if (desc.includes('пасмурно')) icon = '☁️';
        else if (desc.includes('ясно')) icon = '☀️';
        else if (desc.includes('переменная')) icon = '🌤️';
        
        this.weatherIcon.textContent = icon;
    }
    
    showLoading() {
        this.weatherLoading.style.display = 'block';
        this.weatherData.style.display = 'none';
        this.weatherError.style.display = 'none';
        this.proxyInfo.style.display = 'none';
    }
    
    showWeatherData() {
        this.weatherLoading.style.display = 'none';
        this.weatherData.style.display = 'block';
        this.weatherError.style.display = 'none';
    }
    
    showError(message) {
        this.weatherLoading.style.display = 'none';
        this.weatherData.style.display = 'none';
        this.weatherError.style.display = 'block';
        this.weatherError.textContent = message;
        this.proxyInfo.style.display = 'none';
    }
    
    update() {
        this.fetchWeatherData();
    }
}