import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Bookmark Proofbook',
    description: 'Keep the reason, evidence, and a durable export with each bookmark.',
    permissions: ['storage', 'activeTab', 'scripting'],
    host_permissions: ['<all_urls>'],
    action: { default_title: 'Bookmark Proofbook' },
  },
  srcDir: '.',
});
