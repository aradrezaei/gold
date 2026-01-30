// ثابت تبدیل
const OUNCE_TO_GRAM = 31.1035;

// کلاس محاسبه‌گر
class GoldCalculator {
  constructor(marketPrice, dollarRate, globalOunce) {
    this.marketPrice = parseFloat(marketPrice);
    this.dollarRate = parseFloat(dollarRate);
    this.globalOunce = parseFloat(globalOunce);
  }

  calculateGold24k() {
    return (this.globalOunce * this.dollarRate) / OUNCE_TO_GRAM;
  }

  calculateGold18k() {
    return this.calculateGold24k() * (18 / 24);
  }

  calculateBubble() {
    const realPrice = this.calculateGold18k();
    const bubble = this.marketPrice - realPrice;
    const percentage = (bubble / realPrice) * 100;
    return { bubble, percentage, realPrice };
  }

  getStatus(percentage) {
    if (percentage > 15) return { text: '🔴 حباب بسیار بالا', type: 'danger' };
    if (percentage > 10) return { text: '🟠 حباب بالا', type: 'warning' };
    if (percentage > 5) return { text: '🟡 حباب متوسط', type: 'medium' };
    if (percentage > 0) return { text: '🟢 حباب پایین', type: 'low' };
    if (percentage > -5) return { text: '✅ قیمت منصفانه', type: 'fair' };
    return { text: '💚 فرصت خرید', type: 'opportunity' };
  }

  getRecommendation(percentage) {
    if (percentage > 15) return '⛔️ خرید نکنید! حباب بسیار زیاد است. بهتر است منتظر کاهش قیمت بمانید.';
    if (percentage > 10) return '⚠️ توصیه می‌شود صبر کنید. قیمت فعلی بالاتر از حد معمول است.';
    if (percentage > 5) return '💡 قیمت کمی بالاتر از حد معمول است. در صورت نیاز فوری می‌توانید خرید کنید.';
    if (percentage > 0) return '✅ قیمت نسبتاً مناسب است. اجرت و سود طبیعی در قیمت لحاظ شده.';
    if (percentage > -5) return '✅ قیمت بسیار منصفانه است. زمان مناسبی برای خرید.';
    return '🎯 فرصت عالی برای خرید! قیمت پایین‌تر از قیمت واقعی است.';
  }
}

// فرمت کردن اعداد با دقت کامل
function formatNumber(num, decimals = 0) {
  // اگه عدد اعشاری داشت، تا 2 رقم نشون بده
  if (decimals > 0) {
    return new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }
  // برای اعداد صحیح، دقیق بدون گرد کردن
  return new Intl.NumberFormat('fa-IR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.floor(num));
}

// تبدیل اعداد فارسی به انگلیسی
function persianToEnglish(str) {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
  }
  return str;
}

// دریافت تاریخ و زمان
function getDateTime() {
  const now = new Date();
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(now);
}

// فرمت خودکار ورودی
function setupInputFormatting() {
  const inputs = document.querySelectorAll('#marketPrice, #dollarRate, #globalOunce');
  
  inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = persianToEnglish(e.target.value);
      value = value.replace(/[^0-9]/g, '');
      
      if (value) {
        const number = parseInt(value);
        e.target.value = formatNumber(number);
      }
    });

    // جلوگیری از paste کردن متن نامعتبر
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const cleanText = persianToEnglish(pastedText).replace(/[^0-9]/g, '');
      if (cleanText) {
        e.target.value = formatNumber(parseInt(cleanText));
      }
    });
  });
}

// نمایش نتایج
function displayResults(calculator) {
  const { bubble, percentage, realPrice } = calculator.calculateBubble();
  const gold24k = calculator.calculateGold24k();
  const status = calculator.getStatus(percentage);
  const recommendation = calculator.getRecommendation(percentage);

  // نمایش بخش نتایج
  const resultsDiv = document.getElementById('results');
  resultsDiv.classList.remove('hidden');
  resultsDiv.classList.add('animate-slide-down');

  // پر کردن مقادیر با دقت کامل
  document.getElementById('gold24k').textContent = formatNumber(gold24k, 2) + ' تومان';
  document.getElementById('realPrice').textContent = formatNumber(realPrice, 2) + ' تومان';
  document.getElementById('bubbleAmount').textContent = 
    (bubble >= 0 ? '+' : '') + formatNumber(Math.abs(bubble), 2) + ' تومان';
  document.getElementById('bubblePercent').textContent = 
    (percentage >= 0 ? '+' : '') + percentage.toFixed(3) + '%';
  document.getElementById('datetime').textContent = getDateTime();
  document.getElementById('recommendationText').textContent = recommendation;

  // استایل badge وضعیت
  const statusBadge = document.getElementById('statusBadge');
  statusBadge.textContent = status.text;
  
  const statusStyles = {
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-2 border-red-300 dark:border-red-700',
    warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-700',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-2 border-yellow-300 dark:border-yellow-700',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-2 border-green-300 dark:border-green-700',
    fair: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700',
    opportunity: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-2 border-teal-300 dark:border-teal-700'
  };
  
  statusBadge.className = 'px-6 py-3 rounded-full font-bold text-lg shadow-lg ' + statusStyles[status.type];

  // رنگ‌بندی کارت‌های حباب
  const bubbleCard = document.getElementById('bubbleCard');
  const percentCard = document.getElementById('percentCard');
  
  if (percentage > 0) {
    const redClasses = 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-900 dark:text-red-300';
    bubbleCard.className = 'rounded-xl p-4 border-2 ' + redClasses;
    percentCard.className = 'rounded-xl p-4 border-2 ' + redClasses;
  } else {
    const greenClasses = 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-900 dark:text-green-300';
    bubbleCard.className = 'rounded-xl p-4 border-2 ' + greenClasses;
    percentCard.className = 'rounded-xl p-4 border-2 ' + greenClasses;
  }

  // اسکرول به نتایج
  setTimeout(() => {
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);

  // ذخیره در localStorage برای آفلاین
  localStorage.setItem('lastCalculation', JSON.stringify({
    inputs: {
      marketPrice: calculator.marketPrice,
      dollarRate: calculator.dollarRate,
      globalOunce: calculator.globalOunce
    },
    results: {
      gold24k,
      realPrice,
      bubble,
      percentage
    },
    timestamp: new Date().toISOString()
  }));
}

// مدیریت فرم
function setupFormHandler() {
  const form = document.getElementById('goldForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // دریافت مقادیر
    const marketPrice = persianToEnglish(document.getElementById('marketPrice').value).replace(/,/g, '');
    const dollarRate = persianToEnglish(document.getElementById('dollarRate').value).replace(/,/g, '');
    const globalOunce = persianToEnglish(document.getElementById('globalOunce').value).replace(/,/g, '');

    // اعتبارسنجی
    if (!marketPrice || !dollarRate || !globalOunce) {
      alert('لطفاً تمام فیلدها را پر کنید!');
      return;
    }

    if (parseFloat(marketPrice) <= 0 || parseFloat(dollarRate) <= 0 || parseFloat(globalOunce) <= 0) {
      alert('تمام مقادیر باید بیشتر از صفر باشند!');
      return;
    }

    // محاسبه
    const calculator = new GoldCalculator(marketPrice, dollarRate, globalOunce);
    displayResults(calculator);
  });
}

// ریست فرم
function setupResetHandler() {
  const resetBtn = document.getElementById('resetBtn');
  
  resetBtn.addEventListener('click', () => {
    document.getElementById('goldForm').reset();
    document.getElementById('results').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// بارگذاری آخرین محاسبه (آفلاین)
function loadLastCalculation() {
  const lastCalc = localStorage.getItem('lastCalculation');
  if (lastCalc) {
    console.log('✅ آخرین محاسبه بارگذاری شد (حالت آفلاین)');
  }
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
  setupInputFormatting();
  setupFormHandler();
  setupResetHandler();
  loadLastCalculation();
  
  console.log('✅ شاتو آماده است!');
});

// Export برای استفاده در جاهای دیگر
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GoldCalculator, formatNumber };
}