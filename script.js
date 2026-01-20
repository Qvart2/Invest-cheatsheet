// Общие функции для всех страниц

// Валидация ввода
function validatePositiveNumber(value, fieldName) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    alert(`Ошибка: ${fieldName} должно быть положительным числом`);
    return false;
  }
  return num;
}

// Анимация появления элементов при прокрутке
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  for (let el of reveals) {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add('active');
    }
  }
}

// Переключение темы
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Загрузка сохраненной темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.textContent = '☀️ Светлая тема';
  } else {
    themeToggle.textContent = '🌙 Тёмная тема';
  }

  // Обработчик клика
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема';
  });
}

// Общая функция для обновления результатов с таблицей
function updateResultsTable(elementId, data) {
  const container = document.getElementById(elementId);
  if (!container) return;

  let html = '<table>';
  data.forEach(row => {
    html += '<tr>';
    row.forEach(cell => {
      html += `<td>${cell}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  container.innerHTML = html;
}

// Функции калькуляторов
function calculateCredit(amount, months, rate) {
  const monthlyRate = rate / 100 / 12;
  const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const total = payment * months;
  const overpay = total - amount;

  return [
    ['Ежемесячный платёж', payment.toFixed(2) + '&nbsp;₽'],
    ['Общая сумма выплат', total.toFixed(2) + '&nbsp;₽'],
    ['Переплата', overpay.toFixed(2) + '&nbsp;₽']
  ];
}

function calculateDeposit(amount, months, rate) {
  const monthlyRate = rate / 100 / 12;
  const total = amount * Math.pow(1 + monthlyRate, months);
  const profit = total - amount;

  return [
    ['Итоговая сумма', total.toFixed(2) + '&nbsp;₽'],
    ['Доход', profit.toFixed(2) + '&nbsp;₽']
  ];
}

function calculateMortgage(amount, years, rate) {
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const total = payment * months;
  const overpay = total - amount;

  return [
    ['Ежемесячный платёж', payment.toFixed(2) + '&nbsp;₽'],
    ['Общая сумма выплат', total.toFixed(2) + '&nbsp;₽'],
    ['Переплата', overpay.toFixed(2) + '&nbsp;₽']
  ];
}

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
    ['Итоговая сумма', futureValue.toFixed(2) + '&nbsp;₽'],
    ['Вложено всего', invested.toFixed(2) + '&nbsp;₽'],
    ['Прибыль', profit.toFixed(2) + '&nbsp;₽']
  ];
}

function calculateCompound(initial, monthly, years, rate) {
  const annualRate = rate / 100;
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  let futureValue = initial * Math.pow(1 + monthlyRate, months);
  if (monthly > 0) {
    futureValue += monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }

  const invested = initial + monthly * months;
  const profit = futureValue - invested;

  return [
    ['Итоговая сумма', futureValue.toFixed(2) + '&nbsp;₽'],
    ['Вложено всего', invested.toFixed(2) + '&nbsp;₽'],
    ['Прибыль', profit.toFixed(2) + '&nbsp;₽']
  ];
}

function calculateGoal(goal, years, rate, initial) {
  const annualRate = rate / 100;
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  const futureInitial = initial * Math.pow(1 + annualRate, years);
  const needed = goal - futureInitial;
  let monthly = needed / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  if (monthly < 0) {
    monthly = 0;
  }

  return [
    ['Необходимый ежемесячный вклад', monthly.toFixed(2) + '&nbsp;₽'],
    ['Ваша имеющаяся сумма через ' + years + ' лет', futureInitial.toFixed(2) + '&nbsp;₽'],
    ['Недостающая сумма', needed.toFixed(2) + '&nbsp;₽']
  ];
}

// Инициализация калькуляторов
function initCalculators() {
  // Кредитный калькулятор
  const creditForm = document.getElementById("creditForm");
  if (creditForm) {
    creditForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = validatePositiveNumber(document.getElementById("amount").value, "Сумма кредита");
      const months = validatePositiveNumber(document.getElementById("months").value, "Срок");
      const rate = validatePositiveNumber(document.getElementById("rate").value, "Ставка");

      if (amount && months && rate) {
        const data = calculateCredit(amount, months, rate);
        updateResultsTable("result", data);
      }
    });
  }

  // Калькулятор вкладов
  const depositForm = document.getElementById("depositForm");
  if (depositForm) {
    depositForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = validatePositiveNumber(document.getElementById("depositAmount").value, "Сумма вклада");
      const months = validatePositiveNumber(document.getElementById("depositMonths").value, "Срок");
      const rate = validatePositiveNumber(document.getElementById("depositRate").value, "Ставка");

      if (amount && months && rate) {
        const data = calculateDeposit(amount, months, rate);
        updateResultsTable("depositResult", data);
      }
    });
  }

  // Ипотечный калькулятор
  const mortgageForm = document.getElementById("mortgageForm");
  if (mortgageForm) {
    mortgageForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = validatePositiveNumber(document.getElementById("mortgageAmount").value, "Сумма ипотеки");
      const years = validatePositiveNumber(document.getElementById("mortgageYears").value, "Срок");
      const rate = validatePositiveNumber(document.getElementById("mortgageRate").value, "Ставка");

      if (amount && years && rate) {
        const data = calculateMortgage(amount, years, rate);
        updateResultsTable("mortgageResult", data);
      }
    });
  }

  // Калькулятор инвестиций
  const investForm = document.getElementById("investForm");
  if (investForm) {
    investForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = document.getElementById("investAmount").value === '' ? 0 : parseFloat(document.getElementById("investAmount").value);
      const monthly = document.getElementById("investMonthly").value === '' ? 0 : parseFloat(document.getElementById("investMonthly").value);
      const years = validatePositiveNumber(document.getElementById("investYears").value, "Срок");
      const rate = document.getElementById("investRate").value === '' ? 0 : parseFloat(document.getElementById("investRate").value);

      if (amount >= 0 && monthly >= 0 && years && rate >= 0) {
        const data = calculateInvestment(amount, monthly, years, rate);
        updateResultsTable("investResult", data);
      } else {
        alert("Ошибка: Проверьте введенные значения");
      }
    });
  }

  // Калькулятор сложных процентов
  const compoundForm = document.getElementById("compoundForm");
  if (compoundForm) {
    compoundForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const amount = document.getElementById("compoundAmount").value === '' ? 0 : parseFloat(document.getElementById("compoundAmount").value);
      const monthly = document.getElementById("compoundMonthly").value === '' ? 0 : parseFloat(document.getElementById("compoundMonthly").value);
      const years = validatePositiveNumber(document.getElementById("compoundYears").value, "Срок");
      const rate = document.getElementById("compoundRate").value === '' ? 0 : parseFloat(document.getElementById("compoundRate").value);

      if (amount >= 0 && monthly >= 0 && years && rate >= 0) {
        const data = calculateCompound(amount, monthly, years, rate);
        updateResultsTable("compoundResult", data);
      } else {
        alert("Ошибка: Проверьте введенные значения");
      }
    });
  }

  // Калькулятор достижения финансовой цели
  const goalForm = document.getElementById("goalForm");
  if (goalForm) {
    goalForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const goal = validatePositiveNumber(document.getElementById("goalAmount").value, "Целевая сумма");
      const years = validatePositiveNumber(document.getElementById("goalYears").value, "Срок");
      const rate = document.getElementById("goalRate").value === '' ? 0 : parseFloat(document.getElementById("goalRate").value);
      const initial = document.getElementById("goalInitial").value === '' ? 0 : parseFloat(document.getElementById("goalInitial").value);

      if (goal && years && rate >= 0 && initial >= 0) {
        const data = calculateGoal(goal, years, rate, initial);
        updateResultsTable("goalResult", data);
      } else {
        alert("Ошибка: Проверьте введенные значения");
      }
    });
  }
}

// Инициализация теста на риск
function initRiskTest() {
  const riskForm = document.getElementById("riskForm");
  if (riskForm) {
    riskForm.addEventListener("submit", function(e) {
      e.preventDefault();

      let score = 0;
      for (let i = 1; i <= 10; i++) {
        const value = document.querySelector(`input[name="q${i}"]:checked`);
        if (!value) {
          alert("Пожалуйста, ответьте на все вопросы.");
          return;
        }
        score += parseInt(value.value);
      }

      let profile = "";
      let explanation = "";
      if (score <= 17) {
        profile = "Консервативный";
        explanation = "Подходит для сохранения капитала. Вы предпочитаете стабильность и готовы к низкой доходности. Идеально для тех, кто не хочет рисковать своими сбережениями.";
      } else if (score <= 28) {
        profile = "Умеренный";
        explanation = "Баланс между риском и доходностью. Вы готовы к умеренным колебаниям рынка ради стабильного роста капитала.";
      } else {
        profile = "Агрессивный";
        explanation = "Максимальная доходность при высоком риске. Вы готовы к значительным колебаниям и долгосрочным инвестициям.";
      }

      const result = document.getElementById("riskResult");
      result.innerHTML = `<h3>Ваш профиль риска: <strong>${profile}</strong></h3><p>${explanation}</p><button id="retryRiskTest" class="risk-btn">Пройти заново</button>`;

      // Добавляем обработчик для кнопки "Пройти заново"
      document.getElementById("retryRiskTest").addEventListener("click", function() {
        riskForm.reset();
        result.innerHTML = "";
        document.getElementById("portfolioBlock").innerHTML = "";
      });

      generatePortfolio(profile);
    });
  }
}

function generatePortfolio(profile) {
  const block = document.getElementById("portfolioBlock");

  let sets = {
    "Консервативный": [
      ["Облигации", "70%"],
      ["ETF", "20%"],
      ["Акции", "10%"]
    ],
    "Умеренный": [
      ["Облигации", "45%"],
      ["ETF", "35%"],
      ["Акции", "20%"]
    ],
    "Агрессивный": [
      ["Облигации", "15%"],
      ["ETF", "35%"],
      ["Акции", "50%"]
    ]
  };

  let html = `
    <h3>Рекомендуемый портфель:</h3>
    <table class="portfolio-table">
      <tr><th>Актив</th><th>Доля</th></tr>
  `;

  sets[profile].forEach(row => {
    html += `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`;
  });

  html += "</table>";

  block.innerHTML = html;
}

// Инициализация симулятора трейдинга
function initTradingSimulator() {
  let price = 100;
  let balance = 100000;
  let stocks = 0;
  const candles = [];
  const transactions = [];

  const priceEl = document.getElementById('price');
  const balanceEl = document.getElementById('balance');
  const stocksEl = document.getElementById('stocks');
  const portfolioEl = document.getElementById('portfolio');
  const logEl = document.getElementById('log');

  if (!priceEl) return; // Если элементы не найдены, выходим

  function updateUI() {
    priceEl.textContent = price.toFixed(2);
    balanceEl.textContent = balance.toFixed(2);
    stocksEl.textContent = stocks;
    portfolioEl.textContent = (balance + stocks * price).toFixed(2);
  }

  const chartContainer = document.getElementById('chart');
  let chart, candleSeries;

  if (chartContainer) {
    chart = LightweightCharts.createChart(chartContainer, {
      layout: {
        textColor: '#000',
        backgroundColor: '#fff',
      },
      rightPriceScale: {
        borderVisible: true,
      },
      timeScale: {
        borderVisible: true,
      }
    });
    candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickVisible: true
    });
  }

  function newCandle() {
    const now = Date.now() / 1000;
    const open = price;
    const change = price * (Math.random() * 0.04 - 0.02);
    const close = Math.max(1, price + change);
    const high = Math.max(open, close) + Math.random() * 1.5;
    const low = Math.min(open, close) - Math.random() * 1.5;
    price = close;

    const candle = { time: now, open: open, high: high, low: low, close: close };
    candles.push(candle);
    if (candles.length > 40) candles.shift();

    if (candleSeries) {
      candleSeries.setData(candles);
      chart.timeScale().fitContent();
    }
    updateUI();
    logEl.textContent = `📈 Новая свеча: ${close.toFixed(2)} ₽`;
  }

  function resetSimulator() {
    price = 100;
    balance = 100000;
    stocks = 0;
    candles.length = 0;
    transactions.length = 0;
    updateUI();
    logEl.textContent = "Симулятор сброшен. Начните заново!";
    if (candleSeries) candleSeries.setData([]);
    document.getElementById('transactionHistory').innerHTML = '';
  }

  function addTransaction(type, lots, priceAtTime, total) {
    const transaction = {
      time: new Date().toLocaleTimeString(),
      type: type,
      lots: lots,
      price: priceAtTime.toFixed(2),
      total: total.toFixed(2)
    };
    transactions.push(transaction);

    const historyEl = document.getElementById('transactionHistory');
    if (historyEl) {
      const row = `<tr><td>${transaction.time}</td><td>${transaction.type}</td><td>${transaction.lots}</td><td>${transaction.price} ₽</td><td>${transaction.total} ₽</td></tr>`;
      historyEl.innerHTML += row;
    }
  }

  const lotInput = document.getElementById("lotCount");
  const buyBtn = document.getElementById("buy");
  const sellBtn = document.getElementById("sell");
  const resetBtn = document.getElementById("resetSimulator");

  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      const lots = Math.max(1, parseInt(lotInput.value) || 1);
      const totalCost = lots * price;

      if (balance >= totalCost) {
        balance -= totalCost;
        stocks += lots;
        updateUI();
        logEl.textContent = `🟢 Куплено ${lots} ${lots === 1 ? "акция" : "акций"} по ${price.toFixed(2)} ₽ (итого: ${totalCost.toFixed(2)} ₽)`;
        addTransaction('Покупка', lots, price, totalCost);
      } else {
        logEl.textContent = "⚠️ Недостаточно средств";
      }
    });
  }

  if (sellBtn) {
    sellBtn.addEventListener("click", () => {
      const lots = Math.max(1, parseInt(lotInput.value) || 1);

      if (stocks >= lots) {
        const totalGain = lots * price;
        balance += totalGain;
        stocks -= lots;
        updateUI();
        logEl.textContent = `🔴 Продано ${lots} ${lots === 1 ? "акция" : "акций"} по ${price.toFixed(2)} ₽ (итого: ${totalGain.toFixed(2)} ₽)`;
        addTransaction('Продажа', lots, price, totalGain);
      } else {
        logEl.textContent = "⚠️ Недостаточно акций";
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetSimulator);
  }



  updateUI();
  for (let i = 0; i < 5; i++) newCandle();
  setInterval(newCandle, 4000);
}

// Функции для навигации по статьям
function showCategory(categoryId) {
  // Скрыть все категории
  const categories = document.querySelectorAll('.article-category');
  categories.forEach(cat => cat.style.display = 'none');

  // Показать выбранную категорию
  const selectedCategory = document.getElementById(categoryId);
  if (selectedCategory) {
    selectedCategory.style.display = 'block';
  }

  // Обновить активную кнопку
  const buttons = document.querySelectorAll('.article-nav-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const activeButton = document.querySelector(`[onclick="showCategory('${categoryId}')"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // Сохранить активную категорию в localStorage
  localStorage.setItem('activeArticleCategory', categoryId);
}

// Инициализация активной категории статей при загрузке страницы
function initArticleCategory() {
  const savedCategory = localStorage.getItem('activeArticleCategory') || 'basics';
  showCategory(savedCategory);
}

// Инициализация
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', () => {
  revealOnScroll();
  if (document.getElementById('theme-toggle')) initThemeToggle();
  initCalculators();
  initRiskTest();
  initTradingSimulator();
  if (document.querySelector('.article-nav')) initArticleCategory();
});
