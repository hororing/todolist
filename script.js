class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        // 할일 추가
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');

        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // 필터 버튼들
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    addTodo() {
        const todoInput = document.getElementById('todoInput');
        const text = todoInput.value.trim();

        if (text === '') {
            this.showNotification('할일을 입력해주세요!', 'warning');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.render();
        this.updateStats();

        todoInput.value = '';
        this.showNotification('할일이 추가되었습니다!', 'success');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
            this.updateStats();
            
            const message = todo.completed ? '완료되었습니다!' : '진행중으로 변경되었습니다!';
            this.showNotification(message, 'info');
        }
    }

    deleteTodo(id) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index > -1) {
            const deletedTodo = this.todos[index];
            this.todos.splice(index, 1);
            this.saveTodos();
            this.render();
            this.updateStats();
            this.showNotification('할일이 삭제되었습니다!', 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // 필터 버튼 활성화 상태 변경
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.style.display = 'none';
            emptyState.classList.add('show');
        } else {
            todoList.style.display = 'block';
            emptyState.classList.remove('show');
            
            todoList.innerHTML = filteredTodos.map(todo => this.createTodoElement(todo)).join('');
            
            // 이벤트 리스너 다시 바인딩
            this.bindTodoEvents();
        }
    }

    createTodoElement(todo) {
        const completedClass = todo.completed ? 'completed' : '';
        const checked = todo.completed ? 'checked' : '';
        
        return `
            <div class="todo-item ${completedClass}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${checked}>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="todo-delete" title="삭제">×</button>
            </div>
        `;
    }

    bindTodoEvents() {
        // 체크박스 이벤트
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const todoItem = e.target.closest('.todo-item');
                const id = parseInt(todoItem.dataset.id);
                this.toggleTodo(id);
            });
        });

        // 삭제 버튼 이벤트
        document.querySelectorAll('.todo-delete').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', (e) => {
                const todoItem = e.target.closest('.todo-item');
                const id = parseInt(todoItem.dataset.id);
                this.deleteTodo(id);
            });
        });
    }

    updateStats() {
        const totalCount = this.todos.length;
        const completedCount = this.todos.filter(todo => todo.completed).length;
        const pendingCount = totalCount - completedCount;

        document.getElementById('totalCount').textContent = totalCount;
        document.getElementById('completedCount').textContent = completedCount;
        document.getElementById('pendingCount').textContent = pendingCount;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 새 알림 생성
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        // 스타일 추가
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 닫기 버튼 이벤트
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // 3초 후 자동 제거
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
}); 