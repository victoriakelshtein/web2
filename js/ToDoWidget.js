import UIComponent from './UIComponent.js';

export default class ToDoWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Список дел'
        });
        this.tasks = config.tasks || [];
    }
    
    render() {
        super.render();
        this.renderContent();
        return this.element;
    }
    
    renderContent() {
        this.contentElement.innerHTML = `
            <div class="todo-container">
                <div class="todo-input">
                    <input type="text" class="todo-input-field" placeholder="Добавить новую задачу...">
                    <button class="btn-add">Добавить</button>
                </div>
                <ul class="todo-list"></ul>
            </div>
        `;
        
        this.todoList = this.contentElement.querySelector('.todo-list');
        this.inputField = this.contentElement.querySelector('.todo-input-field');
        this.addButton = this.contentElement.querySelector('.btn-add');
        
        this.setupTodoEventListeners();
        this.renderTasks();
    }
    
    setupTodoEventListeners() {
        this.addButton.addEventListener('click', () => this.addTask());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        // Делегирование событий для списка задач
        this.todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const taskId = e.target.closest('li').dataset.id;
                this.removeTask(taskId);
            } else if (e.target.classList.contains('task-checkbox')) {
                const taskId = e.target.closest('li').dataset.id;
                this.toggleTask(taskId);
            }
        });
    }
    
    addTask() {
        const text = this.inputField.value.trim();
        if (text) {
            const task = {
                id: Date.now().toString(),
                text: text,
                completed: false
            };
            this.tasks.push(task);
            this.renderTasks();
            this.inputField.value = '';
        }
    }
    
    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.renderTasks();
    }
    
    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
        }
    }
    
    renderTasks() {
        this.todoList.innerHTML = '';
        
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="btn-delete">Удалить</button>
            `;
            
            this.todoList.appendChild(li);
        });
    }
}