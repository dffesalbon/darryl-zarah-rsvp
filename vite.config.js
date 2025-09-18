import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // github repository
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',   // root landing page
        rsvp: 'rsvp.html'     // RSVP page
      }
    }
  }
});
