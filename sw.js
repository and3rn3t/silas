// Service Worker for Silas Anderson's Personal Website
// Provides offline functionality and caching

const CACHE_NAME = 'silas-anderson-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/script.js',
    '/styles.css',
    '/manifest.json'
];

// Install Event - Cache static resources
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated successfully');
            return self.clients.claim();
        })
    );
});

// Fetch Event - Serve cached content when offline
self.addEventListener('fetch', event => {
    // Only handle same-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }

                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request).then(fetchResponse => {
                    // Check if we received a valid response
                    if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                        return fetchResponse;
                    }

                    // Clone the response as it can only be used once
                    const responseToCache = fetchResponse.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return fetchResponse;
                }).catch(error => {
                    console.log('Service Worker: Network request failed, serving offline page');

                    // Return offline fallback for navigation requests
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }

                    throw error;
                });
            })
    );
});

// Background Sync for saving game progress
self.addEventListener('sync', event => {
    if (event.tag === 'save-game-data') {
        event.waitUntil(saveGameDataToCloud());
    }
});

// Save game data when connection is restored
async function saveGameDataToCloud() {
    try {
        // In a real implementation, this would sync with a backend
        console.log('Service Worker: Game data sync completed');

        // Notify the main thread that sync completed
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                data: 'Game data synchronized'
            });
        });
    } catch (error) {
        console.error('Service Worker: Game data sync failed:', error);
    }
}

// Push notifications (for future features)
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New adventure awaits!',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: 'silas-notification',
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'explore',
                title: 'Play Game',
                icon: '/action-play.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/action-close.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Silas Anderson', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#game')
        );
    } else if (event.action === 'close') {
        // Just close the notification
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
