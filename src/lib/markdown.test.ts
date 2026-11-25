import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderUntrustedMarkdown } from './markdown.ts';

test('untrusted markdown never emits a script-capable link or raw HTML', () => {
	const attacks = [
		'[a](javascript:alert(1))',
		'[a](&#106;avascript:alert(1))',
		'[[x]](&#106;avascript:alert(1))',
		'See [d][r].\n\n[r]: &#106;avascript:alert(1)',
		'[a](java&#9;script:alert(1))',
		'<javascript:alert(1)>',
		'![i](data:text/html,x)',
		'x <img src=x onerror=alert(1)> y'
	];
	for (const md of attacks) {
		const html = renderUntrustedMarkdown(md);
		assert.doesNotMatch(html, /<img[^>]*onerror/i, md);
		for (const [, url] of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
			assert.match(url, /^(?:https?:|mailto:|[#/])/i, md);
		}
	}
});

test('untrusted markdown keeps normal links', () => {
	assert.match(renderUntrustedMarkdown('[gh](https://github.com)'), /href="https:\/\/github.com"/);
});
