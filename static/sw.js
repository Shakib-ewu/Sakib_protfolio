// gatsby-plugin-offline was removed. Browsers that installed its service worker
// will fetch this file on their next visit; it clears the old caches and
// unregisters itself so visitors always get the latest version of the site.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(client => client.navigate(client.url))),
  );
});
