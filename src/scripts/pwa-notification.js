// مدیریت نوتیفیکیشن PWA و راهنمای نصب
class PWANotification {
  constructor() {
    this.platform = this.detectPlatform();
    this.isInstalled = this.checkInstalled();
    this.hasShownNotification = localStorage.getItem('pwa-notification-shown');
    
    this.init();
  }

  detectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    // iOS
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return {
        type: 'ios',
        name: 'iOS',
        icon: '🍎',
        color: 'from-gray-800 to-gray-900',
        isApple: true
      };
    }

    // macOS
    if (/mac/.test(platform) && !/iphone|ipad|ipod/.test(userAgent)) {
      return {
        type: 'macos',
        name: 'macOS',
        icon: '🍎',
        color: 'from-gray-700 to-gray-800',
        isApple: true
      };
    }

    // Android
    if (/android/.test(userAgent)) {
      return {
        type: 'android',
        name: 'Android',
        icon: '🤖',
        color: 'from-green-600 to-green-700',
        isAndroid: true
      };
    }

    // Linux
    if (/linux/.test(platform)) {
      return {
        type: 'linux',
        name: 'Linux',
        icon: '🐧',
        color: 'from-blue-600 to-blue-700',
        isLinux: true
      };
    }

    // Windows
    if (/win/.test(platform)) {
      return {
        type: 'windows',
        name: 'Windows',
        icon: '🪟',
        color: 'from-blue-500 to-blue-600',
        isWindows: true
      };
    }

    return {
      type: 'unknown',
      name: 'Desktop',
      icon: '💻',
      color: 'from-purple-600 to-purple-700'
    };
  }

  checkInstalled() {
    // چک کردن standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // چک کردن برای iOS
    if (window.navigator.standalone === true) {
      return true;
    }

    return false;
  }

  getInstallInstructions() {
    const instructions = {
      ios: {
        title: 'نصب شاتو روی آیفون/آیپد',
        steps: [
          'روی دکمه Share (مشارکت) پایین صفحه کلیک کنید',
          'به پایین اسکرول کنید و "Add to Home Screen" را پیدا کنید',
          'روی آن کلیک کرده و "Add" را بزنید',
          'حالا شاتو روی صفحه اصلی شماست! 🎉'
        ],
        note: '💡 بعد از نصب، می‌توانید بدون اینترنت هم استفاده کنید!',
        emoji: '📱'
      },
      android: {
        title: 'نصب شاتو روی اندروید',
        steps: [
          'روی منوی مرورگر (⋮) کلیک کنید',
          'گزینه "Add to Home screen" یا "نصب اپلیکیشن" را انتخاب کنید',
          'روی "Install" یا "نصب" کلیک کنید',
          'شاتو مثل یک اپلیکیشن واقعی نصب شد! 🎉'
        ],
        note: '🔥 کاملاً آفلاین کار می‌کند و خیلی سریع‌تره!',
        emoji: '📲'
      },
      windows: {
        title: 'نصب شاتو روی ویندوز',
        steps: [
          'روی آیکون + در نوار آدرس کلیک کنید',
          'یا از منوی مرورگر "Install Shato" را انتخاب کنید',
          'روی "Install" کلیک کنید',
          'شاتو مثل یک برنامه معمولی نصب شد! 🎉'
        ],
        note: '⚡ سریع‌تر، راحت‌تر و بدون اینترنت!',
        emoji: '🖥️'
      },
      macos: {
        title: 'نصب شاتو روی مک',
        steps: [
          'روی آیکون + در نوار آدرس کلیک کنید',
          'یا از منوی "File" → "Add to Dock" را انتخاب کنید',
          'شاتو به Dock اضافه شد!',
          'حالا مثل یک برنامه معمولی استفاده کنید 🎉'
        ],
        note: '✨ تجربه‌ای مثل اپلیکیشن‌های Native!',
        emoji: '💻'
      },
      linux: {
        title: 'نصب شاتو روی لینوکس',
        steps: [
          'روی آیکون + در نوار آدرس کلیک کنید',
          'یا از منوی مرورگر "Install" را انتخاب کنید',
          'روی "Install" کلیک کنید',
          'شاتو نصب شد! 🎉'
        ],
        note: '🐧 آزاد، متن‌باز و کاملاً آفلاین!',
        emoji: '🖥️'
      }
    };

    return instructions[this.platform.type] || instructions.windows;
  }

  createNotification() {
    if (this.isInstalled || this.hasShownNotification) {
      return null;
    }

    const instructions = this.getInstallInstructions();
    
    const notification = document.createElement('div');
    notification.id = 'pwa-notification';
    notification.className = 'fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-slide-up';
    
    notification.innerHTML = `
      <div class="bg-gradient-to-br ${this.platform.color} rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div class="p-6 text-white">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="text-4xl">${instructions.emoji}</div>
              <div>
                <h3 class="font-bold text-lg">شاتو رو نصب کن!</h3>
                <p class="text-white/80 text-sm">${this.platform.icon} ${this.platform.name}</p>
              </div>
            </div>
            <button onclick="document.getElementById('pwa-notification').remove(); localStorage.setItem('pwa-notification-shown', 'true');" 
                    class="text-white/60 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Steps -->
          <div class="space-y-3 mb-4">
            ${instructions.steps.map((step, index) => `
              <div class="flex gap-3 text-sm">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  ${index + 1}
                </div>
                <p class="text-white/90">${step}</p>
              </div>
            `).join('')}
          </div>

          <!-- Note -->
          <div class="bg-white/10 rounded-lg p-3 mb-4">
            <p class="text-sm text-white/90">${instructions.note}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button onclick="document.getElementById('pwa-notification').style.display='none'; localStorage.setItem('pwa-notification-shown', 'temp');" 
                    class="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all text-sm">
              بعداً
            </button>
            <button onclick="document.getElementById('pwa-notification').remove(); localStorage.setItem('pwa-notification-shown', 'true');" 
                    class="flex-1 px-4 py-2 bg-white hover:bg-white/90 text-gray-900 rounded-lg font-bold transition-all text-sm">
              متوجه شدم ✓
            </button>
          </div>
        </div>

        <!-- Features -->
        <div class="bg-black/20 px-6 py-3 flex items-center justify-center gap-4 text-xs text-white/70">
          <span>⚡ سریع</span>
          <span>•</span>
          <span>🔌 آفلاین</span>
          <span>•</span>
          <span>📱 PWA</span>
        </div>
      </div>
    `;

    return notification;
  }

  show() {
    // نمایش بعد از 3 ثانیه
    setTimeout(() => {
      const notification = this.createNotification();
      if (notification) {
        document.body.appendChild(notification);
        console.log('✅ نوتیفیکیشن PWA نمایش داده شد');
      }
    }, 3000);
  }

  init() {
    console.log('🎯 پلتفرم شناسایی شد:', this.platform.name);
    console.log('📱 نصب شده؟', this.isInstalled);

    if (!this.isInstalled && !this.hasShownNotification) {
      this.show();
    }

    // مدیریت beforeinstallprompt (برای Chrome/Edge)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      console.log('💾 رویداد beforeinstallprompt فعال شد');
      
      // می‌تونی اینجا یه دکمه نصب سفارشی بسازی
      const installBtn = document.getElementById('install-button');
      if (installBtn) {
        installBtn.style.display = 'block';
        installBtn.addEventListener('click', async () => {
          e.prompt();
          const { outcome } = await e.userChoice;
          console.log('📊 نتیجه نصب:', outcome);
        });
      }
    });

    // تشخیص نصب موفق
    window.addEventListener('appinstalled', () => {
      console.log('✅ شاتو با موفقیت نصب شد!');
      localStorage.setItem('pwa-notification-shown', 'true');
      const notification = document.getElementById('pwa-notification');
      if (notification) {
        notification.remove();
      }
    });
  }
}

// راه‌اندازی
document.addEventListener('DOMContentLoaded', () => {
  const pwa = new PWANotification();
  console.log('✅ PWA Notification آماده شد');
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PWANotification };
}