export default defineBackground(() => {
  chrome.runtime.onMessage.addListener(async (message: any) => {
    if (message?.type !== 'capture-active-page') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.startsWith('http')) throw new Error('Open a regular web page first. Browser pages cannot be captured.');
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        title: document.title,
        url: location.href,
        selectedText: window.getSelection()?.toString() || '',
        extract: document.body?.innerText?.replace(/\s+/g, ' ').trim().slice(0, 12000) || '',
      }),
    });
    return results[0]?.result;
  });
});
