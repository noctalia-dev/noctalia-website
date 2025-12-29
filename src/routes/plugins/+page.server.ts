export async function load() {
	try {
		const response = await fetch('https://raw.githubusercontent.com/noctalia-dev/noctalia-plugins/main/registry.json');
		if (!response.ok) throw new Error('Failed to fetch plugins');
		const data = await response.json();
		return {
			plugins: data.plugins || []
		};
	} catch (error) {
		console.error('Error fetching plugins:', error);
		return {
			plugins: []
		};
	}
}
