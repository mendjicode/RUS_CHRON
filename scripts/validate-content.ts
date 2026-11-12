import {readFile,readdir} from 'node:fs/promises';
import {lessonSchema} from '../src/content/schema';
import {termSchema,personSchema,worldContextSchema} from '../src/content/reference-schema';
import {sources} from '../src/content/sources';
import {places} from '../src/content/geography';
import {atlasSheets,atlasCampaigns} from '../src/content/atlas';
import type {CurriculumEntry,Era,Lesson} from '../src/content/schema';
const json=async(path:string)=>JSON.parse(await readFile(path,'utf-8'));
const curriculum=await json('src/content/curriculum.json') as CurriculumEntry[];
const eras=await json('src/content/eras.json') as Era[];
const people=personSchema.array().parse([...await json('src/content/people.json'),...await json('src/content/additional-people.json')]);
const terms=termSchema.array().parse([...await json('src/content/terms.json'),...await json('src/content/additional-terms.json')]);
const contexts=worldContextSchema.array().parse(await json('src/content/world-context.json'));
const files=await readdir('src/content/lessons');
const lessons:Lesson[]=[];const errors:string[]=[];
const assert=(condition:unknown,message:string)=>{if(!condition)errors.push(message);};
for(const file of files.filter(f=>f.endsWith('.json'))){const result=lessonSchema.safeParse(await json(`src/content/lessons/${file}`));if(!result.success)errors.push(`${file}: ${result.error.message}`);else{lessons.push(result.data);assert(file===`${result.data.id}.json`,`${file}: имя файла не совпадает с ID`);}}
for(const [name,items] of Object.entries({curriculum,eras,lessons,people,terms,sources,places,contexts})){const ids=items.map(i=>i.id);assert(ids.length===new Set(ids).size,`${name}: повторяющиеся ID`);}
const questionIds=lessons.flatMap(l=>l.questions.map(q=>q.id));assert(questionIds.length===new Set(questionIds).size,'Повторяющиеся ID вопросов');
for(const entry of curriculum)assert(eras.some(e=>e.id===entry.eraId),`${entry.id}: неизвестная эпоха`);
for(const lesson of lessons){const entry=curriculum.find(e=>e.id===lesson.id);assert(entry,`${lesson.id}: нет в программе`);assert(entry?.title===lesson.title,`${lesson.id}: название расходится с программой`);assert(entry?.eraId===lesson.eraId,`${lesson.id}: эпоха расходится с программой`);assert(entry?.module===lesson.module,`${lesson.id}: модуль расходится с программой`);
 const text=lesson.sections.flatMap(s=>s.paragraphs).join(' ');assert(text.split(/\s+/).length>=350,`${lesson.id}: основной текст короче 350 слов`);assert(!/lorem ipsum|TODO|ЗДЕСЬ ТЕКСТ/i.test(text),`${lesson.id}: найден заполнитель`);
 for(const id of lesson.sources)assert(sources.some(s=>s.id===id),`${lesson.id}: неизвестный источник ${id}`);
 for(const id of lesson.people)assert(people.some(p=>p.id===id),`${lesson.id}: неизвестная личность ${id}`);
 for(const id of lesson.terms)assert(terms.some(t=>t.id===id),`${lesson.id}: неизвестный термин ${id}`);
 for(const id of lesson.mapPoints)assert(places.some(p=>p.id===id),`${lesson.id}: неизвестное место ${id}`);
 for(const q of lesson.questions){assert(q.id.startsWith(lesson.id+'-q'),`${q.id}: неверная принадлежность вопроса`);if(!q.selfAssessed&&!['text','fill'].includes(q.type)){assert(q.options&&new Set(q.options).size===q.options.length,`${q.id}: пустые/повторные варианты`);for(const a of q.answer)assert(q.options?.includes(a),`${q.id}: ответ отсутствует среди вариантов`);}if(q.sourceId)assert(sources.some(s=>s.id===q.sourceId),`${q.id}: неизвестный источник фрагмента`);if(q.type==='order')assert(q.options?.length===q.answer.length,`${q.id}: порядок неполон`);if(['single','source','cause','map'].includes(q.type))assert(q.answer.length===1,`${q.id}: требуется один ответ`);}
}
for(const p of people){for(const id of p.sources)assert(sources.some(s=>s.id===id),`${p.id}: неизвестный источник ${id}`);for(const id of p.lessonIds??[])assert(curriculum.some(l=>l.id===id),`${p.id}: неизвестный связанный урок ${id}`);assert(eras.some(e=>e.id===p.eraId),`${p.id}: неизвестная эпоха ${p.eraId}`);}
for(const item of [...terms,...contexts]){for(const id of item.sources??[])assert(sources.some(s=>s.id===id),`${item.id}: неизвестный источник ${id}`);for(const id of item.lessonIds??[])assert(curriculum.some(l=>l.id===id),`${item.id}: неизвестный связанный урок ${id}`);}
for(const c of contexts)assert(eras.some(e=>e.id===c.eraId),`${c.id}: неизвестная эпоха`);
for(const sheet of atlasSheets){await readFile(`public/assets/atlas/${sheet.file}`);for(const id of sheet.lessonIds)assert(curriculum.some(l=>l.id===id),`${sheet.id}: неизвестный урок`);for(const id of sheet.eraIds)assert(eras.some(e=>e.id===id),`${sheet.id}: неизвестная эпоха`);}
for(const campaign of atlasCampaigns){assert(curriculum.some(l=>l.id===campaign.lessonId),`${campaign.id}: неизвестный урок`);for(const step of campaign.steps){assert(places.some(p=>p.id===step.placeId),`${campaign.id}: неизвестное место ${step.placeId}`);for(const id of step.sourceIds)assert(sources.some(s=>s.id===id),`${campaign.id}: неизвестный источник ${id}`);}}
for(const image of await json('src/content/illustrations.json')){await readFile(`public/${image.file}`);assert(sources.some(s=>s.id===image.sourceId),`${image.id}: неизвестный источник изображения`);for(const id of image.lessonIds)assert(curriculum.some(l=>l.id===id),`${image.id}: неизвестный урок`);}
for(const portrait of await json('src/content/portraits.json')){await readFile(`public/${portrait.file}`);assert(people.some(p=>p.name===portrait.personName),`${portrait.personName}: портрет без личности`);}
for(const era of eras)assert(lessons.some(l=>l.eraId===era.id),`${era.id}: нет написанных уроков`);
for(const source of sources){const url=new URL(source.url);assert(url.protocol==='https:',`${source.id}: небезопасная ссылка`);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`Контент: ${eras.length} эпох, ${curriculum.length} тем, ${lessons.length} написанных уроков, ${questionIds.length} вопросов, ${terms.length} терминов, ${people.length} персоналий. Ссылки между объектами и структура корректны. Это не историческая экспертиза.`);
