import { defineConfig } from 'vite';

export default defineConfig({
  base: `/${import.meta.env.VITE_REPOSITORY}/`, // github repository
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',   // root landing page
        rsvp: 'rsvp.html'     // RSVP page
      }
    }
  }
});
