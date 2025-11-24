import UIComponent from './UIComponent.js';

export default class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Погода'
        });
        this.city = config.city || 'Москва';
        this.weatherData = null;
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
                <button class="btn-refresh">Обновить</button>
            </div>
        `;
        
        this.weatherLoading = this.contentElement.querySelector('.weather-loading');
        this.weatherData = this.contentElement.querySelector('.weather-data');
        this.weatherError = this.contentElement.querySelector('.weather-error');
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
            
            // Используем бесплатный API от wttr.in который не требует ключа
            const response = await fetch(
                `https://wttr.in/${encodeURIComponent(this.city)}?format=j1&lang=ru`
            );
            
            if (!response.ok) {
                throw new Error('Город не найден или ошибка сервера');
            }
            
            const data = await response.json();
            this.processWeatherData(data);
            
        } catch (error) {
            console.error('Ошибка получения данных о погоде:', error);
            this.showError('Не удалось получить данные о погоде. Проверьте название города.');
        }
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
            this.showError('Ошибка обработки данных погоды');
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
        
        this.weatherIcon.textContent = icon;
    }
    
    showLoading() {
        this.weatherLoading.style.display = 'block';
        this.weatherData.style.display = 'none';
        this.weatherError.style.display = 'none';
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
    }
    
    update() {
        this.fetchWeatherData();
    }
}