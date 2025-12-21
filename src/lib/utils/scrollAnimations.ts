export function setupScrollAnimation(
	element: HTMLElement, 
	callback: (isVisible: boolean) => void,
	options?: {
		threshold?: number;
		rootMargin?: string;
		once?: boolean;
	}
) {
	const { threshold = 0.1, rootMargin = '0px', once = true } = options || {};
	
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					callback(true);
					if (once) {
						observer.unobserve(entry.target);
					}
				} else if (!once) {
					callback(false);
				}
			});
		},
		{ threshold, rootMargin }
	);
	
	observer.observe(element);
	
	return () => observer.disconnect();
}

