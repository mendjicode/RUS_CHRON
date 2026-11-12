import {readFile,readdir,writeFile} from 'node:fs/promises';
import {z} from 'zod';
const schema=z.object({id:z.string().min(1),title:z.string().min(3),author:z.string(),kind:z.enum(['Первичный источник','Исследование','Энциклопедия','Учебное издание','Данные']),url:z.url().refine(v=>v.startsWith('https://')),note:z.string().min(10),checkedAt:z.string().optional()});
const folder='src/content/source-packs';
const files=(await readdir(folder)).filter(f=>f.endsWith('.json')).sort();
const entries=[];const ids=new Set<string>();
for(const file of files){const data=schema.array().parse(JSON.parse(await readFile(`${folder}/${file}`,'utf8')));for(const entry of data){if(ids.has(entry.id))throw new Error(`Повтор источника ${entry.id} в ${file}`);ids.add(entry.id);entries.push(entry);}}
const target='src/content/source-packs.generated.json';
let existing:unknown[]=[];try{existing=JSON.parse(await readFile(target,'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
for(const old of schema.array().parse(existing))if(!ids.has(old.id))throw new Error(`Генерация удалила бы ${old.id}; сначала восстановите источник в его пакете.`);
await writeFile(target,JSON.stringify(entries,null,2)+'\n');console.log(`Реестр дополнительных источников: ${entries.length} из ${files.length} пакетов.`);
