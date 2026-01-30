const CACHE_NAME = 'shato-v1.0.0';
const STATIC_CACHE = 'shato-static-v1';
const DYNAMIC_CACHE = 'shato-dynamic-v1';

// فایل‌هایی که باید کش بشن
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// نصب Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker در حال نصب...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 کش کردن فایل‌های استاتیک...');
      return cache.addAll(STATIC_FILES);
    }).then(() => {
      console.log('✅ نصب کامل شد!');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ خطا در نصب:', error);
    })
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', (event) => {
  console.log('⚡ Service Worker فعال شد');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('🗑️ حذف کش قدیمی:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('✅ فعال‌سازی کامل شد!');
      return self.clients.claim();
    })
  );
});

// دریافت درخواست‌ها
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // فقط درخواست‌های same-origin
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('✅ از کش:', request.url);
        return cachedResponse;
      }

      // اگه توی کش نبود، از شبکه بگیر
      return fetch(request).then((networkResponse) => {
        // فقط response های موفق رو کش کن
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
            console.log('💾 کش شد:', request.url);
          });
        }

        return networkResponse;
      }).catch((error) => {
        console.error('❌ خطا در دریافت:', request.url, error);
        
        // اگه آفلاین بود و صفحه HTML بود
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match('/');
        }
        
        throw error;
      });
    })
  );
});

// مدیریت پیام‌ها
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Sync API برای محاسبات آفلاین (اختیاری)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-calculations') {
    event.waitUntil(syncCalculations());
  }
});

async function syncCalculations() {
  console.log('🔄 همگام‌سازی محاسبات...');
  // اینجا می‌تونی محاسبات ذخیره شده رو sync کنی
}

// نوتیفیکیشن Push (اختیاری برای آپدیت‌ها)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'به‌روزرسانی جدید در دسترس است',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    tag: 'shato-notification',
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'شاتو', options)
  );
});

// کلیک روی نوتیفیکیشن
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

console.log('🚀 Service Worker شاتو آماده است!');