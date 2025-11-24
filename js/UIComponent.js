export default class UIComponent {
    constructor(config = {}) {
        this.id = config.id || `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.title = config.title || 'Виджет';
        this.isMinimized = false;
        this.isClosed = false;
    }
    
    render() {
        const widget = document.createElement('div');
        widget.className = 'widget';
        widget.id = this.id;
        
        widget.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">${this.title}</h3>
                <div class="widget-controls">
                    <button class="btn-minimize">−</button>
                    <button class="btn-close">×</button>
                </div>
            </div>
            <div class="widget-content"></div>
        `;
        
        this.element = widget;
        this.contentElement = widget.querySelector('.widget-content');
        
        this.setupEventListeners();
        
        return widget;
    }
    
    setupEventListeners() {
        const minimizeBtn = this.element.querySelector('.btn-minimize');
        const closeBtn = this.element.querySelector('.btn-close');
        
        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        closeBtn.addEventListener('click', () => this.destroy());
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.contentElement.style.display = this.isMinimized ? 'none' : 'block';
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.isClosed = true;
    }
    
    update() {
        // Абстрактный метод для обновления содержимого виджета
    }
}