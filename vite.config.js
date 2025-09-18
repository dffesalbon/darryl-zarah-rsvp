import { defineConfig } from 'vite';

export default defineConfig({
  base: 'fesalbon-ong-rsvp', // github repository
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',   // root landing page
        rsvp: 'rsvp.html'     // RSVP page
      }
    }
  }
});
