import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Случайная цитата'
        });
        this.quotes = [
            "Единственный способ сделать великую работу — любить то, что ты делаешь. - Стив Джобс",
            "Инновации отличают лидера от догоняющего. - Стив Джобс",
            "Будущее принадлежит тем, кто верит в красоту своей мечты. - Элеонора Рузвельт",
            "Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма. - Уинстон Черчилль",
            "Единственный предел нашему завтрашнему дню — наши сегодняшние сомнения. - Франклин Рузвельт",
            "Ваше время ограничено, не тратьте его, живя чужой жизнью. - Стив Джобс",
            "Лучший способ предсказать будущее — создать его. - Абрахам Линкольн",
            "Не оглядывайся назад и не мечтай о будущем, собери свои мысли и живи настоящим. - Будда",
            "Трудности готовят обычных людей к необычной судьбе. - К.С. Льюис",
            "Самый большой риск — не рисковать. В быстро меняющемся мире стратегия, основанная на отсутствии риска, является единственной гарантированной стратегией провала. - Марк Цукерберг"
        ];
        this.currentQuote = this.getRandomQuote();
    }
    
    render() {
        super.render();
        this.renderContent();
        return this.element;
    }
    
    renderContent() {
        this.contentElement.innerHTML = `
            <div class="quote-container">
                <p class="quote-text">"${this.currentQuote}"</p>
                <button class="btn-refresh">Новая цитата</button>
            </div>
        `;
        
        this.quoteText = this.contentElement.querySelector('.quote-text');
        this.refreshButton = this.contentElement.querySelector('.btn-refresh');
        
        this.refreshButton.addEventListener('click', () => this.refreshQuote());
    }
    
    getRandomQuote() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }
    
    refreshQuote() {
        this.currentQuote = this.getRandomQuote();
        this.quoteText.textContent = `"${this.currentQuote}"`;
    }
}