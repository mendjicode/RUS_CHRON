import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {describe,it,expect} from 'vitest';
const {atlasImagePath}=createRequire(import.meta.url)('../electron/local-assets.cjs') as {atlasImagePath:(url:string,root:string)=>string|null};
const root=path.resolve('/tmp/ruschron-dist');
const local=(relative:string)=>pathToFileURL(path.join(root,relative)).href;
describe('ограничение локальных окон Electron',()=>{
 it('открывает только изображение из локального каталога атласа',()=>expect(atlasImagePath(local('assets/atlas/sheet.png'),root)).toBe(path.join(root,'assets/atlas/sheet.png')));
 it('не открывает произвольные локальные файлы и HTML',()=>{for(const file of ['index.html','assets/atlas/page.html','assets/atlas/script.svg','assets/atlas-other/sheet.png','assets/atlas/../secret.jpg'])expect(atlasImagePath(local(file),root)).toBeNull();});
 it('не допускает сетевые адреса и исполняемые схемы',()=>{for(const url of ['https://example.com/sheet.png','javascript:alert(1)','data:image/svg+xml,test','not a url'])expect(atlasImagePath(url,root)).toBeNull();});
});
