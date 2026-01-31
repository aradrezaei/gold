// کلاس محاسبه‌گر سود
class ProfitCalculator {
  constructor() {
    this.trades = [];
    this.tradeIdCounter = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupInputFormatting();
    console.log('✅ ماشین‌حساب سود آماده شد');
  }

  setupEventListeners() {
    // افزودن معامله
    document.getElementById('addTrade')?.addEventListener('click', () => {
      this.addTrade();
    });

    // محاسبه سود
    document.getElementById('calculateProfit')?.addEventListener('click', () => {
      this.calculate();
    });

    // ریست
    document.getElementById('resetProfit')?.addEventListener('click', () => {
      this.reset();
    });
  }

  setupInputFormatting() {
    // فرمت خودکار ورودی‌ها
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('trade-buy') || 
          e.target.classList.contains('trade-sell') ||
          e.target.classList.contains('trade-amount')) {
        this.formatInput(e.target);
      }
    });
  }

  formatInput(input) {
    let value = this.persianToEnglish(input.value);
    value = value.replace(/[^0-9.]/g, '');
    
    if (value) {
      // جدا کردن اعشار
      const parts = value.split('.');
      parts[0] = parseInt(parts[0]).toLocaleString('fa-IR');
      if (parts.length > 1) {
        input.value = parts[0] + '.' + parts[1];
      } else {
        input.value = parts[0];
      }
    }
  }

  persianToEnglish(str) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    for (let i = 0; i < 10; i++) {
      str = str.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    return str;
  }

  addTrade() {
    this.tradeIdCounter++;
    const container = document.getElementById('tradesContainer');
    
    const colors = [
      { light: 'from-blue-50 to-purple-50', dark: 'from-blue-900/20 to-purple-900/20', border: 'border-blue-200 dark:border-blue-700', badge: 'bg-blue-500' },
      { light: 'from-green-50 to-teal-50', dark: 'from-green-900/20 to-teal-900/20', border: 'border-green-200 dark:border-green-700', badge: 'bg-green-500' },
      { light: 'from-orange-50 to-red-50', dark: 'from-orange-900/20 to-red-900/20', border: 'border-orange-200 dark:border-orange-700', badge: 'bg-orange-500' },
      { light: 'from-purple-50 to-pink-50', dark: 'from-purple-900/20 to-pink-900/20', border: 'border-purple-200 dark:border-purple-700', badge: 'bg-purple-500' },
    ];
    
    const colorIndex = this.tradeIdCounter % colors.length;
    const color = colors[colorIndex];
    
    const tradeHtml = `
      <div class="trade-item bg-gradient-to-r ${color.light} dark:${color.dark} rounded-2xl p-6 border-2 ${color.border} animate-scale-in">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span class="trade-number ${color.badge} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">${this.tradeIdCounter + 1}</span>
            <span>معامله ${this.tradeIdCounter + 1}</span>
          </h3>
          <button class="text-red-500 hover:text-red-700 dark:text-red-400 remove-trade" data-id="${this.tradeIdCounter}">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💵 قیمت خرید (تومان)
            </label>
            <input
              type="text"
              class="trade-buy w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="۱۷,۰۰۰,۰۰۰"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ⚖️ مقدار (گرم)
            </label>
            <input
              type="text"
              class="trade-amount w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="۵"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              💸 قیمت فروش (تومان)
            </label>
            <input
              type="text"
              class="trade-sell w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
              placeholder="۲۰,۰۰۰,۰۰۰"
            />
          </div>
        </div>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', tradeHtml);
    
    // اضافه کردن event listener برای دکمه حذف
    const removeBtn = container.querySelector(`.remove-trade[data-id="${this.tradeIdCounter}"]`);
    removeBtn?.addEventListener('click', (e) => {
      this.removeTrade(e.target.closest('button').dataset.id);
    });
    
    // اسکرول به معامله جدید
    container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  removeTrade(id) {
    const tradeItem = document.querySelector(`.remove-trade[data-id="${id}"]`)?.closest('.trade-item');
    if (tradeItem) {
      tradeItem.style.transform = 'scale(0.9)';
      tradeItem.style.opacity = '0';
      setTimeout(() => {
        tradeItem.remove();
        this.renumberTrades();
      }, 200);
    }
  }

  renumberTrades() {
    const tradeItems = document.querySelectorAll('.trade-item');
    tradeItems.forEach((item, index) => {
      const numberSpan = item.querySelector('.trade-number');
      if (numberSpan) {
        numberSpan.textContent = index + 1;
      }
      const title = item.querySelector('h3 span:last-child');
      if (title) {
        title.textContent = `معامله ${index + 1}`;
      }
    });
  }

  calculate() {
    const tradeItems = document.querySelectorAll('.trade-item');
    this.trades = [];
    
    tradeItems.forEach((item, index) => {
      const buyInput = item.querySelector('.trade-buy');
      const sellInput = item.querySelector('.trade-sell');
      const amountInput = item.querySelector('.trade-amount');
      
      const buyPrice = parseFloat(this.persianToEnglish(buyInput.value).replace(/,/g, ''));
      const sellPrice = parseFloat(this.persianToEnglish(sellInput.value).replace(/,/g, ''));
      const amount = parseFloat(this.persianToEnglish(amountInput.value).replace(/,/g, ''));
      
      if (!isNaN(buyPrice) && !isNaN(sellPrice) && !isNaN(amount)) {
        const invested = buyPrice * amount;
        const revenue = sellPrice * amount;
        const profit = revenue - invested;
        const profitPercent = (profit / invested) * 100;
        
        this.trades.push({
          index: index + 1,
          buyPrice,
          sellPrice,
          amount,
          invested,
          revenue,
          profit,
          profitPercent
        });
      }
    });
    
    if (this.trades.length === 0) {
      alert('لطفاً حداقل یک معامله کامل وارد کنید!');
      return;
    }
    
    this.displayResults();
  }

  displayResults() {
    const totalInvested = this.trades.reduce((sum, t) => sum + t.invested, 0);
    const totalRevenue = this.trades.reduce((sum, t) => sum + t.revenue, 0);
    const totalProfit = totalRevenue - totalInvested;
    const roi = (totalProfit / totalInvested) * 100;
    
    // نمایش بخش نتایج
    const resultsDiv = document.getElementById('profitResults');
    resultsDiv.classList.remove('hidden');
    resultsDiv.classList.add('animate-slide-down');
    
    // کارت کل
    const totalCard = document.getElementById('totalCard');
    if (totalProfit >= 0) {
      totalCard.className = 'bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 text-center border-2 border-green-200 dark:border-green-700';
      document.getElementById('totalProfit').className = 'text-3xl font-bold text-green-600 dark:text-green-400';
      document.getElementById('totalProfit').textContent = '+' + this.formatNumber(totalProfit) + ' تومان';
    } else {
      totalCard.className = 'bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 text-center border-2 border-red-200 dark:border-red-700';
      document.getElementById('totalProfit').className = 'text-3xl font-bold text-red-600 dark:text-red-400';
      document.getElementById('totalProfit').textContent = this.formatNumber(totalProfit) + ' تومان';
    }
    
    // ROI
    document.getElementById('roi').textContent = roi.toFixed(2) + '%';
    
    // سرمایه کل
    document.getElementById('totalInvested').textContent = this.formatNumber(totalInvested) + ' تومان';
    
    // جزئیات معاملات
    const breakdown = document.getElementById('tradesBreakdown');
    breakdown.innerHTML = this.trades.map(trade => {
      const profitClass = trade.profit >= 0 
        ? 'text-green-600 dark:text-green-400' 
        : 'text-red-600 dark:text-red-400';
      const bgClass = trade.profit >= 0
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      
      return `
        <div class="${bgClass} rounded-xl p-4 border">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="font-bold text-gray-700 dark:text-gray-300">معامله ${trade.index}</span>
              <span class="text-sm text-gray-600 dark:text-gray-400">${this.formatNumber(trade.amount)} گرم</span>
            </div>
            <div class="text-left">
              <div class="font-bold ${profitClass}">${trade.profit >= 0 ? '+' : ''}${this.formatNumber(trade.profit)} تومان</div>
              <div class="text-sm ${profitClass}">${trade.profitPercent >= 0 ? '+' : ''}${trade.profitPercent.toFixed(2)}%</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-600 dark:text-gray-400 flex gap-4">
            <span>خرید: ${this.formatNumber(trade.buyPrice)}</span>
            <span>فروش: ${this.formatNumber(trade.sellPrice)}</span>
          </div>
        </div>
      `;
    }).join('');
    
    // اسکرول به نتایج
    setTimeout(() => {
      resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  formatNumber(num) {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  }

  reset() {
    document.getElementById('profitResults').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
  new ProfitCalculator();
});