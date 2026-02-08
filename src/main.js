import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './data/items-database.js'

const app = createApp(App)
app.use(router)
app.mount('#app')

router.afterEach(() => {
	requestAnimationFrame(() => {
		const el = document.querySelector('#app .slide-in');
		if (!el || typeof window.anime !== 'function') return;
		el.style.opacity = 0;
		el.style.transform = 'translateY(8px)';
		window.anime({
			targets: el,
			opacity: [0, 1],
			translateY: [8, 0],
			easing: 'easeOutCubic',
			duration: 400
		});
	});
});

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').then((registration) => {
			if (registration.waiting) {
				window.dispatchEvent(new CustomEvent('swUpdated', { detail: registration }));
			}
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;
				if (newWorker) {
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && registration.waiting) {
							window.dispatchEvent(new CustomEvent('swUpdated', { detail: registration }));
						}
					});
				}
			});
		});
	})
}
