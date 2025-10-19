// Service Worker for push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? 'New Notification';
  const options = {
    body: data.body ?? '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data.url,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});