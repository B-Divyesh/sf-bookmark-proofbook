import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Bookmark Proofbook',
    description: 'Save why a bookmark mattered, search its context, and export your proofbook.',
    permissions: ['storage', 'activeTab', 'scripting'],
    host_permissions: ['<all_urls>'],
    action: { default_title: 'Bookmark Proofbook' },
  },
  srcDir: '.',
});
