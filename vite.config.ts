import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({base:'./',plugins:[react(),tailwindcss(),VitePWA({registerType:'autoUpdate',injectRegister:null,manifest:{name:'Хроники России',icons:[{src:'icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}],short_name:'Хроники',lang:'ru',start_url:'./',display:'standalone',background_color:'#f8f7f3',theme_color:'#315f50'},workbox:{globPatterns:['**/*.{js,css,html,json,geojson,svg,ttf,woff2,jpg,png,txt}'],dontCacheBustURLsMatching:/-[A-Za-z0-9_-]{8}\./,maximumFileSizeToCacheInBytes:6000000,navigateFallback:'index.html'}})],build:{rollupOptions:{output:{manualChunks(id){const match=id.match(/\/src\/content\/lessons\/(\d{2})-/);if(match)return `lessons-era-${match[1]}`;}}}},server:{host:'0.0.0.0'},test:{environment:'node'}} as import('vite').UserConfig);
