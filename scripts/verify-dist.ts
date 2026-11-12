import {readFile,access,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const sw=await readFile('dist/sw.js','utf8');
const entries=[...sw.matchAll(/\{url:"([^"]+)",revision:(null|"[^"]+")\}/g)].map(m=>({url:m[1],revision:m[2]}));
if(!entries.length)throw new Error('Не найден список precache. Перепроверьте формат Service Worker после обновления плагина.');
const seen=new Map<string,string>();
for(const e of entries){if(seen.has(e.url)&&seen.get(e.url)!==e.revision)throw new Error(`Конфликт ревизий офлайн-кэша: ${e.url}`);seen.set(e.url,e.revision);await access(path.join('dist',e.url));}
const required=['index.html','icon.svg','assets/golos.ttf','assets/literata.ttf','assets/kremlin.jpg','assets/land.geojson'];
async function assetFiles(folder:string):Promise<string[]>{const result:string[]=[];for(const entry of await readdir(folder,{withFileTypes:true})){const file=path.join(folder,entry.name);if(entry.isDirectory())result.push(...await assetFiles(file));else result.push(file);}return result;}
for(const file of await assetFiles('dist/assets'))if(/\.(?:js|css|json|geojson|svg|ttf|woff2|jpg|jpeg|png|txt)$/.test(file))required.push(path.relative('dist',file).split(path.sep).join('/'));
for(const file of required)if(!seen.has(file))throw new Error(`Ресурс не включён в офлайн-кэш: ${file}`);
const index=await readFile('dist/index.html','utf8');
for(const match of index.matchAll(/(?:src|href)="(\.[^"]+)"/g))await access(path.resolve('dist',match[1]));
if(index.includes('registerSW.js'))throw new Error('Регистрация Service Worker не должна автоматически выполняться на file://.');
const cssFiles=(await readdir('dist/assets')).filter(f=>f.endsWith('.css'));
for(const file of cssFiles){const css=await readFile(path.join('dist/assets',file),'utf8');for(const match of css.matchAll(/url\(([^)]+)\)/g)){const url=match[1].replace(/["']/g,'');if(!url.startsWith('data:')&&!url.startsWith('http'))await access(path.resolve('dist/assets',url));}}
console.log(`Сборка: ${seen.size} локальных ресурсов в precache; шрифты, изображение, география и HTML включены. Конфликтов ревизий и отсутствующих ресурсов не найдено. Это статическая проверка, не браузерный тест.`);
