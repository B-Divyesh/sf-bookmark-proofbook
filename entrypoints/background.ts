export default defineBackground(() => {
  chrome.runtime.onMessage.addListener(async (message: any) => {
    if (message?.type !== 'capture-active-page') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.startsWith('http')) throw new Error('Open a regular web page first. Browser pages cannot be captured.');
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Keep this in lockstep with extractTextFromHtml(). executeScript
        // functions cannot close over module imports.
        const html = document.documentElement.outerHTML;
        const extract = html
          .replace(/<!--[\s\S]*?-->/g, ' ')
          .replace(/<(?:script|style|noscript|template)\b[^>]*>[\s\S]*?<\/(?:script|style|noscript|template)>/gi, ' ')
          .replace(/<\/?(?:address|article|aside|blockquote|br|dd|div|dl|dt|figcaption|figure|footer|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|table|td|th|tr|ul)\b[^>]*>/gi, ' ')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 12000);
        return { title: document.title, url: location.href, selectedText: window.getSelection()?.toString() || '', extract };
      },
    });
    return results[0]?.result;
  });
});
