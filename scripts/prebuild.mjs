// Runs the independent asset generators concurrently.
import { spawn } from 'node:child_process';

const scripts = ['build-og', 'build-github-showcase', 'build-plugin-wall'];

const codes = await Promise.all(
	scripts.map(
		(name) =>
			new Promise((resolve) => {
				spawn(process.execPath, [`scripts/${name}.mjs`], { stdio: 'inherit' }).on('close', resolve);
			})
	)
);

process.exit(codes.some((c) => c !== 0) ? 1 : 0);
