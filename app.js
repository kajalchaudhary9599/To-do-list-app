// ===== TO-DO LIST APP =====
// Features: Add, Delete, Complete, Filter, LocalStorage

// ---- State ----
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ---- DOM Elements ----
const input     = document.getElementById('todo-input');
const addBtn    = document.getElementById('add-btn');
const todoList  = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearBtn  = document.getElementById('clear-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ---- Save to localStorage ----
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// ---- Add a Task ----
function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  const todo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.push(todo);
  saveTodos();
  renderTodos();
  input.value = '';
  input.focus();
}

// ---- Delete a Task ----
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

// ---- Toggle Complete ----
function toggleTodo(id) {
  todos = todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  renderTodos();
}

// ---- Clear Completed ----
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
}

// ---- Get Filtered Todos ----
function getFilteredTodos() {
  if (currentFilter === 'completed') return todos.filter(t => t.completed);
  if (currentFilter === 'pending')   return todos.filter(t => !t.completed);
  return todos;
}

// ---- Update Task Count ----
function updateCount() {
  const pending = todos.filter(t => !t.completed).length;
  taskCount.textContent = `${pending} task${pending !== 1 ? 's' : ''} remaining`;
}

// ---- Render Todos ----
function renderTodos() {
  const filtered = getFilteredTodos();
  todoList.innerHTML = '';

  if (filtered.length === 0) {
    todoList.innerHTML = `<p class="empty-state">No tasks here!</p>`;
    updateCount();
    return;
  }

  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="todo-checkbox" onclick="toggleTodo(${todo.id})"></div>
      <span class="todo-text">${escapeHTML(todo.text)}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">✕</button>
    `;

    todoList.appendChild(li);
  });

  updateCount();
}

// ---- Prevent XSS ----
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- Event Listeners ----

// Add button click
addBtn.addEventListener('click', addTodo);

// Press Enter to add
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Clear completed
clearBtn.addEventListener('click', clearCompleted);

// ---- Initial Render ----
renderTodos();
