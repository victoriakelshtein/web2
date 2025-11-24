import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import WeatherWidget from './WeatherWidget.js';
import CryptoWidget from './CryptoWidget.js';

export default class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
    }
    
    addWidget(widgetType, config = {}) {
        let widget;
        
        switch(widgetType) {
            case 'todo':
                widget = new ToDoWidget(config);
                break;
            case 'quote':
                widget = new QuoteWidget(config);
                break;
            case 'weather':
                widget = new WeatherWidget(config);
                break;
            case 'crypto':
                widget = new CryptoWidget(config);
                break;
            default:
                console.error('Неизвестный тип виджета:', widgetType);
                return;
        }
        
        this.widgets.push(widget);
        this.container.appendChild(widget.render());
        
        // Обновляем сетку после добавления виджета
        this.updateLayout();
        
        return widget.id;
    }
    
    removeWidget(widgetId) {
        const widgetIndex = this.widgets.findIndex(widget => widget.id === widgetId);
        
        if (widgetIndex !== -1) {
            const widget = this.widgets[widgetIndex];
            widget.destroy();
            this.widgets.splice(widgetIndex, 1);
            
            // Обновляем сетку после удаления виджета
            this.updateLayout();
        }
    }
    
    updateLayout() {
        // Применяем CSS Grid для автоматического размещения виджетов
        this.container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    }
    
    getWidgets() {
        return this.widgets;
    }
}