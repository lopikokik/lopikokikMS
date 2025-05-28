// DOM элементы
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const logoutButton = document.getElementById('logout-button');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const contactForm = document.getElementById('contact-form');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const authButtons = document.getElementById('auth-buttons');
const userProfile = document.getElementById('user-profile');
const usernameDisplay = document.getElementById('username-display');
const closeButtons = document.querySelectorAll('.close');

// Локальное хранилище для пользователей
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Проверка авторизации при загрузке страницы
function checkAuth() {
  if (currentUser) {
    authButtons.style.display = 'none';
    userProfile.style.display = 'flex';
    usernameDisplay.textContent = currentUser.username;
  } else {
    authButtons.style.display = 'flex';
    userProfile.style.display = 'none';
  }
}

// Инициализация страницы
function init() {
  checkAuth();
  
  // Плавная прокрутка для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Открытие модальных окон
loginButton.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

registerButton.addEventListener('click', () => {
  registerModal.style.display = 'block';
});

// Закрытие модальных окон
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
  });
});

window.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = 'none';
  }
  if (e.target === registerModal) {
    registerModal.style.display = 'none';
  }
});

// Обработка формы регистрации
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const passwordConfirm = document.getElementById('register-password-confirm').value;
  
  // Валидация
  if (password !== passwordConfirm) {
    alert('Пароли не совпадают');
    return;
  }
  
  if (users.some(user => user.email === email)) {
    alert('Пользователь с таким email уже существует');
    return;
  }
  
  // Создание нового пользователя
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password // В реальном приложении пароль должен быть захеширован
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Автоматический вход после регистрации
  currentUser = newUser;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  alert('Регистрация успешна!');
  registerModal.style.display = 'none';
  checkAuth();
  registerForm.reset();
});

// Обработка формы входа
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  const user = users.find(user => user.email === email && user.password === password);
  
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert('Вход выполнен успешно!');
    loginModal.style.display = 'none';
    checkAuth();
    loginForm.reset();
  } else {
    alert('Неверный email или пароль');
  }
});

// Обработка выхода из системы
logoutButton.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  checkAuth();
  alert('Вы вышли из системы');
});

// Обработка формы обратной связи
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;
  
  // В реальном приложении здесь был бы код для отправки данных на сервер
  alert(`Спасибо за сообщение, ${name}! Мы свяжемся с вами в ближайшее время.`);
  contactForm.reset();
});

// Функция поиска
function performSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  
  if (!searchTerm) {
    alert('Введите поисковый запрос');
    return;
  }
  
  // Получаем все заголовки секций
  const sections = document.querySelectorAll('.section h2');
  let found = false;
  
  // Ищем первую секцию, заголовок которой содержит поисковый запрос
  for (const section of sections) {
    if (section.textContent.toLowerCase().includes(searchTerm)) {
      // Прокручиваем к найденной секции
      window.scrollTo({
        top: section.offsetTop - 70,
        behavior: 'smooth'
      });
      
      // Подсвечиваем найденную секцию
      section.parentElement.style.backgroundColor = '#f0f8ff';
      setTimeout(() => {
        section.parentElement.style.backgroundColor = '';
      }, 2000);
      
      found = true;
      break;
    }
  }
  
  if (!found) {
    alert('По вашему запросу ничего не найдено');
  }
}

// Обработка поиска
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', init);