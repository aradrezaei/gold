// مدیریت تم
class ThemeManager {
  constructor() {
    this.theme = this.getTheme();
    this.applyTheme();
    this.setupToggle();
    this.watchSystemTheme();
  }

  getTheme() {
    // اول چک کن در localStorage ذخیره شده یا نه
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      console.log('✅ تم از localStorage:', savedTheme);
      return savedTheme;
    }

    // اگه نه، از تنظیمات سیستم استفاده کن
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    console.log('✅ تم از سیستم:', systemTheme);
    return systemTheme;
  }

  applyTheme() {
    const html = document.documentElement;
    
    if (this.theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // تغییر رنگ theme-color برای PWA
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', this.theme === 'dark' ? '#1e293b' : '#eab308');
    }
    
    console.log('🎨 تم اعمال شد:', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
    console.log('🔄 تم تغییر کرد به:', this.theme);
  }

  setupToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) {
      console.warn('⚠️ دکمه تم پیدا نشد!');
      return;
    }

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleTheme();
      
      // انیمیشن دکمه
      toggleBtn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        toggleBtn.style.transform = 'scale(1)';
      }, 100);
    });
    
    console.log('✅ دکمه تم آماده شد');
  }

  // گوش دادن به تغییرات تم سیستم
  watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
        console.log('🔄 تم سیستم تغییر کرد:', this.theme);
      }
    });
  }
}

// راه‌اندازی فوری (قبل از DOMContentLoaded)
let themeManager = null;

// اعمال تم فوری برای جلوگیری از فلش
(function() {
  const savedTheme = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = savedTheme || systemTheme;
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();

// راه‌اندازی کامل بعد از لود
document.addEventListener('DOMContentLoaded', () => {
  themeManager = new ThemeManager();
  console.log('✅ ThemeManager آماده شد');
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager };
}