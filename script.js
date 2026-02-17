// ========== Утилиты ==========

// Форматирование денежных сумм
function formatMoney(amount) {
  return amount.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' ₽';
}

// Форматирование процентов
function formatPercent(value) {
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }) + '%';
}

// Валидация положительного числа
function validatePositiveNumber(value, fieldName, maxValue = null) {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) {
    showNotification(`Ошибка: ${fieldName} должно быть положительным числом`, 'error');
    return false;
  }
  if (maxValue !== null && num > maxValue) {
    showNotification(`Ошибка: ${fieldName} не может быть больше ${maxValue}`, 'error');
    return false;
  }
  return num;
}

// Показать уведомление
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
    <span class="notification-message">${message}</span>
  `;
  
  // Добавляем стили динамически
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#dbeafe'};
    color: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#2563eb'};
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: slideInRight 0.3s ease;
    max-width: 350px;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ========== Анимации ==========

// Анимация появления при скролле
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el, index) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add('active');
      // Добавляем задержку для последовательной анимации
      el.style.transitionDelay = `${index * 0.1}s`;
    }
  });
}

// Плавная прокрутка к элементу
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ========== Тема ==========

// Переключение темы
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  if (!themeToggle) return;

  // Загрузка сохраненной темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.innerHTML = '<span>☀️</span> Светлая';
  } else {
    themeToggle.innerHTML = '<span>🌙</span> Тёмная';
  }

  // Обработчик клика
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<span>☀️</span> Светлая' : '<span>🌙</span> Тёмная';
    
    // Обновление графика при смене темы
    if (typeof updateChartTheme === 'function') {
      updateChartTheme();
    }
  });
}

// ========== Мобильное меню ==========

function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
  });
  
  // Закрыть меню при клике на ссылку
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.innerHTML = '☰';
    });
  });
  
  // Закрыть меню при клике вне его
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      menuToggle.innerHTML = '☰';
    }
  });
}

// ========== Калькуляторы ==========

// Общая функция обновления результатов
function updateResultsTable(elementId, data) {
  const container = document.getElementById(elementId);
  if (!container) return;

  let html = '<table>';
  data.forEach(row => {
    html += '<tr>';
    html += `<td>${row[0]}</td>`;
    html += `<td>${row[1]}</td>`;
    html += '</tr>';
  });
  html += '</table>';
  
  container.innerHTML = html;
  container.style.animation = 'fadeIn 0.3s ease';
}

// Кредитный калькулятор
function calculateCredit(amount, months, rate) {
  const monthlyRate = rate / 100 / 12;
  const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const total = payment * months;
  const overpay = total - amount;

  return [
    ['Ежемесячный платёж', formatMoney(payment)],
    ['Общая сумма выплат', formatMoney(total)],
    ['Переплата', formatMoney(overpay)]
  ];
}

// Калькулятор вкладов
function calculateDeposit(amount, months, rate) {
  const monthlyRate = rate / 100 / 12;
  const total = amount * Math.pow(1 + monthlyRate, months);
  const profit = total - amount;

  return [
    ['Итоговая сумма', formatMoney(total)],
    ['Доход', formatMoney(profit)]
  ];
}

// Ипотечный калькулятор
function calculateMortgage(amount, years, rate) {
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const total = payment * months;
  const overpay = total - amount;

  return [
    ['Ежемесячный платёж', formatMoney(payment)],
    ['Общая сумма выплат', formatMoney(total)],
    ['Переплата', formatMoney(overpay)]
  ];
}

// Калькулятор инвестиций
function calculateInvestment(initial, monthly, years, rate) {
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;

  let futureValue = initial * Math.pow(1 + monthlyRate, months);
  for (let i = 1; i <= months; i++) {
    futureValue += monthly * Math.pow(1 + monthlyRate, months - i);
  }

  const invested = initial + monthly * months;
  const profit = futureValue - invested;

  return [
    ['Итоговая сумма', formatMoney(futureValue)],
    ['Вложено всего', formatMoney(invested)],
    ['Прибыль', formatMoney(profit)]
  ];
}

// Калькулятор сложных процентов
function calculateCompound(initial, monthly, years, rate) {
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;

  let futureValue = initial * Math.pow(1 + monthlyRate, months);
  if (monthly > 0) {
    futureValue += monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }

  const invested = initial + monthly * months;
  const profit = futureValue - invested;

  return [
    ['Итоговая сумма', formatMoney(futureValue)],
    ['Вложено всего', formatMoney(invested)],
    ['Прибыль', formatMoney(profit)]
  ];
}

// Калькулятор цели
function calculateGoal(goal, years, rate, initial) {
  const annualRate = rate / 100;
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  const futureInitial = initial * Math.pow(1 + annualRate, years);
  const needed = goal - futureInitial;
  let monthly = needed > 0 ? needed / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : 0;

  if (monthly < 0) monthly = 0;

  return [
    ['Необходимый ежемесячный вклад', formatMoney(monthly)],
    ['Ваша сумма через ' + years + ' лет', formatMoney(futureInitial)],
    ['Недостающая сумма', formatMoney(Math.max(0, needed))]
  ];
}

// Инициализация калькуляторов
function initCalculators() {
  // Кредитный калькулятор
  const creditForm = document.getElementById("creditForm");
  if (creditForm) {
    creditForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = validatePositiveNumber(document.getElementById("amount").value, "Сумма кредита", 100000000);
      const months = validatePositiveNumber(document.getElementById("months").value, "Срок (месяцев)", 600);
      const rate = validatePositiveNumber(document.getElementById("rate").value, "Ставка", 100);

      if (amount && months && rate) {
        const data = calculateCredit(amount, months, rate);
        updateResultsTable("result", data);
        showNotification('Расчёт выполнен успешно!', 'success');
      }
    });
  }

  // Калькулятор вкладов
  const depositForm = document.getElementById("depositForm");
  if (depositForm) {
    depositForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = validatePositiveNumber(document.getElementById("depositAmount").value, "Сумма вклада", 100000000);
      const months = validatePositiveNumber(document.getElementById("depositMonths").value, "Срок (месяцев)", 600);
      const rate = validatePositiveNumber(document.getElementById("depositRate").value, "Ставка", 100);

      if (amount && months && rate) {
        const data = calculateDeposit(amount, months, rate);
        updateResultsTable("depositResult", data);
        showNotification('Расчёт выполнен успешно!', 'success');
      }
    });
  }

  // Ипотечный калькулятор
  const mortgageForm = document.getElementById("mortgageForm");
  if (mortgageForm) {
    mortgageForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = validatePositiveNumber(document.getElementById("mortgageAmount").value, "Сумма ипотеки", 100000000);
      const years = validatePositiveNumber(document.getElementById("mortgageYears").value, "Срок (лет)", 50);
      const rate = validatePositiveNumber(document.getElementById("mortgageRate").value, "Ставка", 100);

      if (amount && years && rate) {
        const data = calculateMortgage(amount, years, rate);
        updateResultsTable("mortgageResult", data);
        showNotification('Расчёт выполнен успешно!', 'success');
      }
    });
  }

  // Калькулятор инвестиций
  const investForm = document.getElementById("investForm");
  if (investForm) {
    investForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("investAmount").value) || 0;
      const monthly = parseFloat(document.getElementById("investMonthly").value) || 0;
      const years = validatePositiveNumber(document.getElementById("investYears").value, "Срок (лет)", 50);
      const rate = parseFloat(document.getElementById("investRate").value) || 0;

      if (years) {
        const data = calculateInvestment(amount, monthly, years, rate);
        updateResultsTable("investResult", data);
        showNotification('Расчёт выполнен успешно!', 'success');
      }
    });
  }

  // Калькулятор сложных процентов
  const compoundForm = document.getElementById("compoundForm");
  if (compoundForm) {
    compoundForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("compoundAmount").value) || 0;
      const monthly = parseFloat(document.getElementById("compoundMonthly").value) || 0;
      const years = validatePositiveNumber(document.getElementById("compoundYears").value, "Срок (лет)", 50);
      const rate = parseFloat(document.getElementById("compoundRate").value) || 0;

      if (years) {
        const data = calculateCompound(amount, monthly, years, rate);
        updateResultsTable("compoundResult", data);
        showNotification('Расчёт выполнен успешно!', 'success');
      }
    });
  }

  // Калькулятор цели
  const goalForm = document.getElementById("goalForm");
  if (goalForm) {
    goalForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const goal = validatePositiveNumber(document.getElementById("goalAmount").value, "Целевая сумма", 100000000);
      const years = validatePositiveNumber(document.getElementById("goalYears").value, "Срок (лет)", 50);
      const rate = parseFloat(document.getElementById("goalRate").value) || 0;
      const initial = parseFloat(document.getElementById("goalInitial").value) || 0;

      if (goal && years) {
        const data = calculateGoal(goal, years, rate, initial);
        updateResultsTable("goalResult", data);
        showNotification('Расчёт выполнен успешно!', 'success');
      }
    });
  }
}

// ========== Тест на риск ==========

function initRiskTest() {
  const riskForm = document.getElementById("riskForm");
  if (!riskForm) return;

  riskForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let score = 0;
    let answeredQuestions = 0;
    
    for (let i = 1; i <= 10; i++) {
      const value = document.querySelector(`input[name="q${i}"]:checked`);
      if (value) {
        score += parseInt(value.value);
        answeredQuestions++;
      }
    }

    if (answeredQuestions < 10) {
      showNotification(`Пожалуйста, ответьте на все вопросы. Осталось: ${10 - answeredQuestions}`, 'error');
      return;
    }

    let profile = "";
    let emoji = "";
    let explanation = "";
    
    if (score <= 17) {
      profile = "Консервативный";
      emoji = "🛡️";
      explanation = "Подходит для сохранения капитала. Вы предпочитаете стабильность и готовы к низкой доходности. Идеально для тех, кто не хочет рисковать своими сбережениями.";
    } else if (score <= 28) {
      profile = "Умеренный";
      emoji = "⚖️";
      explanation = "Баланс между риском и доходностью. Вы готовы к умеренным колебаниям рынка ради стабильного роста капитала.";
    } else {
      profile = "Агрессивный";
      emoji = "🚀";
      explanation = "Максимальная доходность при высоком риске. Вы готовы к значительным колебаниям и долгосрочным инвестициям.";
    }

    const result = document.getElementById("riskResult");
    result.innerHTML = `
      <h3>${emoji} Ваш профиль риска: <strong>${profile}</strong></h3>
      <p>${explanation}</p>
      <p style="margin-top: 1rem; color: var(--text-secondary);">Баллы: ${score}/40</p>
      <button id="retryRiskTest" class="risk-btn" style="margin-top: 1rem;">🔄 Пройти заново</button>
    `;
    
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });

    document.getElementById("retryRiskTest").addEventListener("click", function() {
      riskForm.reset();
      result.innerHTML = '';
      document.getElementById("portfolioBlock").innerHTML = '';
      showNotification('Тест сброшен. Ответьте на вопросы снова.', 'info');
    });

    generatePortfolio(profile);
    showNotification('Тест пройден! Ваш профиль определён.', 'success');
  });
}

function generatePortfolio(profile) {
  const block = document.getElementById("portfolioBlock");
  if (!block) return;

  const sets = {
    "Консервативный": [
      ["🏦 Облигации", "70%"],
      ["📊 ETF", "20%"],
      ["📈 Акции", "10%"]
    ],
    "Умеренный": [
      ["🏦 Облигации", "45%"],
      ["📊 ETF", "35%"],
      ["📈 Акции", "20%"]
    ],
    "Агрессивный": [
      ["🏦 Облигации", "15%"],
      ["📊 ETF", "35%"],
      ["📈 Акции", "50%"]
    ]
  };

  let html = `
    <div class="portfolio-recommendation">
      <h3 style="text-align: center; margin-bottom: 1.5rem;">💼 Рекомендуемый портфель</h3>
      <table class="portfolio-table">
        <thead>
          <tr><th>Актив</th><th>Доля</th></tr>
        </thead>
        <tbody>
  `;

  sets[profile].forEach(row => {
    html += `<tr><td>${row[0]}</td><td><strong>${row[1]}</strong></td></tr>`;
  });

  html += '</tbody></table></div>';

  block.innerHTML = html;
  block.style.animation = 'fadeInUp 0.5s ease';
}

// ========== Симулятор трейдинга ==========

let tradingChart = null;
let candleSeries = null;

function initTradingSimulator() {
  const priceEl = document.getElementById('price');
  if (!priceEl) return;

  let price = 100;
  let balance = 100000;
  let stocks = 0;
  const candles = [];
  const transactions = [];

  const priceEl_ = document.getElementById('price');
  const balanceEl = document.getElementById('balance');
  const stocksEl = document.getElementById('stocks');
  const portfolioEl = document.getElementById('portfolio');
  const logEl = document.getElementById('log');

  function updateUI() {
    priceEl_.textContent = formatMoney(price).replace(' ₽', '');
    balanceEl.textContent = formatMoney(balance).replace(' ₽', '');
    stocksEl.textContent = stocks;
    portfolioEl.textContent = formatMoney(balance + stocks * price).replace(' ₽', '');
  }

  // Инициализация графика
  const chartContainer = document.getElementById('chart');
  if (chartContainer) {
    const isDark = document.body.classList.contains('dark-theme');
    tradingChart = LightweightCharts.createChart(chartContainer, {
      layout: {
        textColor: isDark ? '#d1d5db' : '#374151',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
      },
      grid: {
        vertLines: { color: isDark ? '#374151' : '#e5e7eb' },
        horzLines: { color: isDark ? '#374151' : '#e5e7eb' },
      },
      rightPriceScale: {
        borderColor: isDark ? '#4b5563' : '#d1d5db',
      },
      timeScale: {
        borderColor: isDark ? '#4b5563' : '#d1d5db',
      }
    });
    
    candleSeries = tradingChart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444'
    });
  }

  function newCandle() {
    const now = Math.floor(Date.now() / 1000);
    const open = price;
    const change = price * (Math.random() * 0.06 - 0.03);
    const close = Math.max(1, price + change);
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    price = close;

    const candle = { time: now, open: open, high: high, low: low, close: close };
    candles.push(candle);
    if (candles.length > 50) candles.shift();

    if (candleSeries) {
      candleSeries.setData(candles);
      tradingChart.timeScale().fitContent();
    }
    updateUI();
    
    const direction = change >= 0 ? '📈' : '📉';
    logEl.textContent = `${direction} Новый тик: ${formatMoney(price).replace(' ₽', '')}`;
    logEl.style.borderLeftColor = change >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
  }

  function resetSimulator() {
    price = 100;
    balance = 100000;
    stocks = 0;
    candles.length = 0;
    transactions.length = 0;
    updateUI();
    logEl.textContent = "🔄 Симулятор сброшен. Начните заново!";
    logEl.style.borderLeftColor = 'var(--lesson-link)';
    if (candleSeries) candleSeries.setData([]);
    document.getElementById('transactionHistory').innerHTML = '<tr><th>Время</th><th>Тип</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>';
    showNotification('Симулятор сброшен', 'info');
  }

  function addTransaction(type, lots, priceAtTime, total) {
    const transaction = {
      time: new Date().toLocaleTimeString('ru-RU'),
      type: type,
      lots: lots,
      price: priceAtTime.toFixed(2),
      total: total.toFixed(2)
    };
    transactions.unshift(transaction);

    const historyEl = document.getElementById('transactionHistory');
    if (historyEl) {
      const row = `
        <tr style="animation: fadeIn 0.3s ease;">
          <td>${transaction.time}</td>
          <td style="color: ${type === 'Покупка' ? 'var(--success-color)' : 'var(--danger-color)'}">
            ${type === 'Покупка' ? '🟢 Куплено' : '🔴 Продано'}
          </td>
          <td>${transaction.lots}</td>
          <td>${transaction.price} ₽</td>
          <td>${transaction.total} ₽</td>
        </tr>
      `;
      const header = historyEl.querySelector('tr');
      historyEl.innerHTML = '';
      historyEl.appendChild(header);
      historyEl.innerHTML += row;
    }
  }

  const lotInput = document.getElementById("lotCount");
  const buyBtn = document.getElementById("buy");
  const sellBtn = document.getElementById("sell");
  const resetBtn = document.getElementById("resetSimulator");

  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      const lots = Math.max(1, parseInt(lotInput?.value) || 1);
      const totalCost = lots * price;

      if (balance >= totalCost) {
        balance -= totalCost;
        stocks += lots;
        updateUI();
        logEl.textContent = `🟢 Куплено ${lots} акций по ${formatMoney(price).replace(' ₽', '')} (Итого: ${formatMoney(totalCost).replace(' ₽', '')})`;
        logEl.style.borderLeftColor = 'var(--success-color)';
        addTransaction('Покупка', lots, price, totalCost);
        showNotification(`Куплено ${lots} акций`, 'success');
      } else {
        logEl.textContent = "⚠️ Недостаточно средств!";
        logEl.style.borderLeftColor = 'var(--danger-color)';
        showNotification('Недостаточно средств для покупки', 'error');
      }
    });
  }

  if (sellBtn) {
    sellBtn.addEventListener("click", () => {
      const lots = Math.max(1, parseInt(lotInput?.value) || 1);

      if (stocks >= lots) {
        const totalGain = lots * price;
        balance += totalGain;
        stocks -= lots;
        updateUI();
        logEl.textContent = `🔴 Продано ${lots} акций по ${formatMoney(price).replace(' ₽', '')} (Итого: ${formatMoney(totalGain).replace(' ₽', '')})`;
        logEl.style.borderLeftColor = 'var(--danger-color)';
        addTransaction('Продажа', lots, price, totalGain);
        showNotification(`Продано ${lots} акций`, 'success');
      } else {
        logEl.textContent = "⚠️ Недостаточно акций для продажи!";
        logEl.style.borderLeftColor = 'var(--danger-color)';
        showNotification('Недостаточно акций', 'error');
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetSimulator);
  }

  updateUI();
  for (let i = 0; i < 10; i++) newCandle();
  setInterval(newCandle, 3000);
}

// Обновление темы графика
function updateChartTheme() {
  if (!tradingChart) return;
  
  const isDark = document.body.classList.contains('dark-theme');
  
  tradingChart.applyOptions({
    layout: {
      textColor: isDark ? '#d1d5db' : '#374151',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    grid: {
      vertLines: { color: isDark ? '#374151' : '#e5e7eb' },
      horzLines: { color: isDark ? '#374151' : '#e5e7eb' },
    },
    rightPriceScale: {
      borderColor: isDark ? '#4b5563' : '#d1d5db',
    },
    timeScale: {
      borderColor: isDark ? '#4b5563' : '#d1d5db',
    }
  });
}

// ========== Статьи ==========

function showCategory(categoryId) {
  const categories = document.querySelectorAll('.article-category');
  categories.forEach(cat => {
    cat.style.display = 'none';
    cat.style.animation = 'fadeIn 0.3s ease';
  });

  const selectedCategory = document.getElementById(categoryId);
  if (selectedCategory) {
    selectedCategory.style.display = 'block';
  }

  const buttons = document.querySelectorAll('.article-nav-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const activeButton = document.querySelector(`[onclick="showCategory('${categoryId}')"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  localStorage.setItem('activeArticleCategory', categoryId);
}

function initArticleCategory() {
  const savedCategory = localStorage.getItem('activeArticleCategory') || 'basics';
  showCategory(savedCategory);
}

// ========== Контактная форма ==========

function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = contactForm.querySelector('input[type="text"]')?.value;
    const email = contactForm.querySelector('input[type="email"]')?.value;
    const message = contactForm.querySelector('textarea')?.value;
    
    if (name && email && message) {
      showNotification('Сообщение отправлено! Мы свяжемся с вами.', 'success');
      contactForm.reset();
    } else {
      showNotification('Пожалуйста, заполните все поля', 'error');
    }
  });
}

// ========== Инициализация ==========

document.addEventListener('DOMContentLoaded', function() {
  // Добавляем CSS для уведомлений
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100px);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Инициализация функций
  revealOnScroll();
  initThemeToggle();
  initMobileMenu();
  initCalculators();
  initRiskTest();
  initTradingSimulator();
  initContactForm();
  
  if (document.querySelector('.article-nav')) {
    initArticleCategory();
  }
  
  // Слушатель скролла
  window.addEventListener('scroll', revealOnScroll);
  
  // Первоначальный вызов для видимых элементов
  revealOnScroll();
});
