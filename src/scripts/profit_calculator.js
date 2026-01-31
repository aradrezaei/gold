class ProfitCalculator {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupInputFormatting();
  }

  setupEventListeners() {
    document.getElementById('addTrade')?.addEventListener('click', () => this.addTrade());
    document.getElementById('calculateProfit')?.addEventListener('click', () => this.calculate());
    document.getElementById('resetProfit')?.addEventListener('click', () => this.reset());
  }

  setupInputFormatting() {
    document.addEventListener('input', (e) => {
      const el = e.target;
      if (el.classList.contains('trade-buy') || el.classList.contains('trade-sell') || el.classList.contains('trade-amount')) {
        let val = el.value.replace(/[^\d.۰-۹]/g, '');
        val = this.p2e(val);
        const parts = val.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        el.value = parts.length > 1 ? parts[0] + '.' + parts[1].slice(0, 4) : parts[0];
      }
    });
  }

  p2e(s) {
    return s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  }

  // متد جدید برای کوچک کردن فونت اعداد بزرگ
  adjustFontSize(id, value) {
    const el = document.getElementById(id);
    const len = value.length;
    if (len > 15) el.style.fontSize = '0.9rem';
    else if (len > 12) el.style.fontSize = '1.2rem';
    else if (len > 9) el.style.fontSize = '1.6rem';
    else el.style.fontSize = '2rem';
  }

  format(n) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n).replace(/,/g, '،');
  }

  calculate() {
    const items = document.querySelectorAll('.trade-item');
    let totalInv = 0, totalRev = 0;
    const tradesData = [];

    items.forEach((item, i) => {
      const getV = (cls) => parseFloat(this.p2e(item.querySelector(cls).value).replace(/,/g, '')) || 0;
      const b = getV('.trade-buy'), s = getV('.trade-sell'), a = getV('.trade-amount');

      if (b > 0 && a > 0) {
        const inv = b * a, rev = s * a, prf = rev - inv;
        totalInv += inv; totalRev += rev;
        tradesData.push({ i: i + 1, a, prf, pct: (prf / inv) * 100 });
      }
    });

    if (tradesData.length === 0) return alert('Please enter valid trade data.');
    this.render(totalInv, totalRev - totalInv, tradesData);
  }

  render(inv, prf, trades) {
    const resDiv = document.getElementById('profitResults');
    resDiv.classList.remove('hidden');

    // Update Invested
    const invStr = this.format(inv);
    document.getElementById('totalInvested').textContent = invStr;
    this.adjustFontSize('totalInvested', invStr);

    // Update ROI
    const roiEl = document.getElementById('roi');
    const roiVal = ((prf / inv) * 100).toFixed(2);
    roiEl.textContent = roiVal + '%';
    roiEl.className = `text-4xl font-black leading-none ${prf >= 0 ? 'text-blue-500' : 'text-red-500'}`;

    // Update Net Profit
    const prfStr = (prf > 0 ? '+' : '') + this.format(prf);
    const prfEl = document.getElementById('totalProfit');
    const card = document.getElementById('totalCard');
    
    prfEl.textContent = prfStr;
    this.adjustFontSize('totalProfit', prfStr);

    if (prf >= 0) {
      card.className = card.className.replace(/text-red-500|bg-red-500\/10/, '') + ' text-green-500 bg-green-500/5';
    } else {
      card.className = card.className.replace(/text-green-500|bg-green-500\/5/, '') + ' text-red-500 bg-red-500/10';
    }

    // Breakdown
    document.getElementById('tradesBreakdown').innerHTML = trades.map(t => `
      <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
        <span class="text-xs font-bold text-gray-500">TRADE ${t.i} <span class="text-[10px] opacity-50">(${t.a}g)</span></span>
        <span class="text-sm font-black ${t.prf >= 0 ? 'text-green-500' : 'text-red-500'}">${t.prf > 0 ? '+' : ''}${this.format(t.prf)} (${t.pct.toFixed(1)}%)</span>
      </div>
    `).join('');

    resDiv.scrollIntoView({ behavior: 'smooth' });
  }

  reset() {
    document.getElementById('profitResults').classList.add('hidden');
    document.querySelectorAll('input').forEach(i => i.value = '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => new ProfitCalculator());