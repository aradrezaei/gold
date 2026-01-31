const GOLD_COEFFICIENT = 31.1034768; 
const PURITY_18K = 0.750;

class GoldCalculator {
  constructor(marketPrice, dollarRate, globalOunce) {
    this.marketPrice = parseFloat(marketPrice);
    this.dollarRate = parseFloat(dollarRate);
    this.globalOunce = parseFloat(globalOunce);
  }

  calculateGold24k() {
    return (this.globalOunce * this.dollarRate) / GOLD_COEFFICIENT;
  }

  calculateGold18k() {
    return this.calculateGold24k() * PURITY_18K;
  }

  calculateBubble() {
    const realPrice = this.calculateGold18k();
    const bubble = this.marketPrice - realPrice;
    const percentage = (bubble / realPrice) * 100;
    
    return { 
      bubble, 
      percentage, 
      realPrice,
      gold24k: this.calculateGold24k()
    };
  }

  getStatus(percentage) {
    if (percentage > 15) return { text: 'حباب بسیار بالا', type: 'danger' };
    if (percentage > 10) return { text: 'حباب بالا', type: 'warning' };
    if (percentage > 5) return { text: 'حباب متوسط', type: 'medium' };
    if (percentage > 0) return { text: 'حباب پایین', type: 'low' };
    if (percentage > -5) return { text: 'قیمت منصفانه', type: 'fair' };
    return { text: 'فرصت خرید استثنایی', type: 'opportunity' };
  }

  getRecommendation(percentage) {
    if (percentage > 15) return 'اختلاف قیمت بسیار زیاد است. خرید در این سطح ریسک بالایی دارد.';
    if (percentage > 10) return 'قیمت بازار حباب قابل توجهی دارد. پیشنهاد به تامل بیشتر.';
    if (percentage > 5) return 'قیمت کمی بالاتر از ارزش ذاتی است. خرید فقط در صورت نیاز فوری.';
    if (percentage > 0) return 'وضعیت پایدار. قیمت بازار با احتساب سود متعارف هماهنگ است.';
    if (percentage > -5) return 'قیمت بسیار ایده آل. ارزش ذاتی با قیمت بازار منطبق است.';
    return 'قیمت بازار پایین‌تر از ارزش واقعی طلا است. فرصت مناسب سرمایه‌گذاری.';
  }
}

function formatNumber(num, precision = 0) {
  return new Intl.NumberFormat('fa-IR', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  }).format(num);
}

function p2e(str) {
  return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
}

function getDateTime() {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());
}

function setupInputFormatting() {
  const inputs = document.querySelectorAll('#marketPrice, #dollarRate, #globalOunce');
  inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let val = p2e(e.target.value).replace(/[^0-9.]/g, '');
      if (val) {
        const parts = val.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "،");
        e.target.value = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
      }
    });
  });
}

function displayResults(calculator) {
  const { bubble, percentage, realPrice, gold24k } = calculator.calculateBubble();
  const status = calculator.getStatus(percentage);
  const rec = calculator.getRecommendation(percentage);

  const resultsDiv = document.getElementById('results');
  resultsDiv.classList.remove('hidden');

  document.getElementById('gold24k').innerHTML = `${formatNumber(gold24k)} <span class="text-xs opacity-50">تومان</span>`;
  document.getElementById('realPrice').innerHTML = `${formatNumber(realPrice)} <span class="text-xs opacity-50">تومان</span>`;
  
  const bblEl = document.getElementById('bubbleAmount');
  bblEl.innerHTML = `${bubble >= 0 ? '＋' : ''}${formatNumber(bubble)} <span class="text-xs opacity-50">تومان</span>`;
  
  const pctEl = document.getElementById('bubblePercent');
  pctEl.textContent = `${percentage >= 0 ? '＋' : ''}${percentage.toFixed(2)}٪`;
  
  document.getElementById('datetime').textContent = getDateTime();
  document.getElementById('recommendationText').textContent = rec;

  const statusBadge = document.getElementById('statusBadge');
  statusBadge.textContent = status.text;
  
  const themes = {
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    warning: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    fair: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    opportunity: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20'
  };
  
  statusBadge.className = 'px-8 py-3 rounded-2xl font-black text-sm border shadow-sm transition-all ' + themes[status.type];

  const bubbleCard = document.getElementById('bubbleCard');
  if (percentage > 0) {
    bubbleCard.className = 'rounded-2xl p-6 border bg-rose-50/30 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/10 text-rose-600';
  } else {
    bubbleCard.className = 'rounded-2xl p-6 border bg-emerald-50/30 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10 text-emerald-600';
  }

  resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function setupFormHandler() {
  document.getElementById('goldForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const getVal = id => p2e(document.getElementById(id).value).replace(/[,،]/g, '');
    const m = getVal('marketPrice'), d = getVal('dollarRate'), o = getVal('globalOunce');

    if (m > 0 && d > 0 && o > 0) {
      displayResults(new GoldCalculator(m, d, o));
    } else {
      alert('تمامی مقادیر باید معتبر و بزرگتر از صفر باشند.');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupInputFormatting();
  setupFormHandler();
});