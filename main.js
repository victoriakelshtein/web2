import Dashboard from './js/Dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard('dashboard');
    
    // Добавляем несколько виджетов по умолчанию для демонстрации
    setTimeout(() => {
        dashboard.addWidget('todo', { title: 'Мои задачи' });
        dashboard.addWidget('weather', { title: 'Погода в Москве', city: 'Москва' });
        dashboard.addWidget('crypto', { 
            title: 'Курсы криптовалют',
            cryptos: ['bitcoin', 'ethereum', 'cardano'] 
        });
        dashboard.addWidget('quote', { title: 'Вдохновляющие цитаты' });
    }, 500);
    
    document.getElementById('add-todo').addEventListener('click', () => {
        dashboard.addWidget('todo');
    });
    
    document.getElementById('add-quote').addEventListener('click', () => {
        dashboard.addWidget('quote');
    });
    
    document.getElementById('add-weather').addEventListener('click', () => {
        dashboard.addWidget('weather');
    });
    
    document.getElementById('add-crypto').addEventListener('click', () => {
        dashboard.addWidget('crypto');
    });
});