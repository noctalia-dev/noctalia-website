import { Marked } from 'marked';

const trusted = new Marked();

// Allow list, not block list: entities like `&#106;` decode only in the browser, so a block list misses them.
const SAFE_URL = /^(?:https?:|mailto:|[#/])/i;

function escapeHtml(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Third-party markdown: raw HTML is shown as text and script-capable URLs are neutralised.
const untrusted = new Marked({
	walkTokens(token) {
		if ((token.type === 'link' || token.type === 'image') && !SAFE_URL.test(token.href)) {
			token.href = '#';
		}
	},
	renderer: {
		html: ({ text }) => escapeHtml(text)
	}
});

/** Markdown we author (blog posts, our own GitHub releases); raw HTML passes through. */
export function renderMarkdown(content: string): string {
	return trusted.parse(content, { async: false }) as string;
}

/** Markdown from outside contributors (plugin READMEs). */
export function renderUntrustedMarkdown(content: string): string {
	return untrusted.parse(content, { async: false }) as string;
}
