import {readFile,readdir} from 'node:fs/promises';
import {lessonSchema} from '../src/content/schema';
import {sources} from '../src/content/sources';
import {places} from '../src/content/geography';
import type {CurriculumEntry,Era,Lesson} from '../src/content/schema';
const json=async(path:string)=>JSON.parse(await readFile(path,'utf-8'));
const curriculum=await json('src/content/curriculum.json') as CurriculumEntry[];
const eras=await json('src/content/eras.json') as Era[];
const people=await json('src/content/people.json') as {id:string;sources:string[]}[];
const terms=await json('src/content/terms.json') as {id:string}[];
const files=await readdir('src/content/lessons');
const lessons:Lesson[]=[];const errors:string[]=[];
const assert=(condition:unknown,message:string)=>{if(!condition)errors.push(message);};
for(const file of files.filter(f=>f.endsWith('.json'))){const result=lessonSchema.safeParse(await json(`src/content/lessons/${file}`));if(!result.success)errors.push(`${file}: ${result.error.message}`);else{lessons.push(result.data);assert(file===`${result.data.id}.json`,`${file}: имя файла не совпадает с ID`);}}
for(const [name,items] of Object.entries({curriculum,eras,lessons,people,terms,sources,places})){const ids=items.map(i=>i.id);assert(ids.length===new Set(ids).size,`${name}: повторяющиеся ID`);}
const questionIds=lessons.flatMap(l=>l.questions.map(q=>q.id));assert(questionIds.length===new Set(questionIds).size,'Повторяющиеся ID вопросов');
for(const entry of curriculum)assert(eras.some(e=>e.id===entry.eraId),`${entry.id}: неизвестная эпоха`);
for(const lesson of lessons){const entry=curriculum.find(e=>e.id===lesson.id);assert(entry,`${lesson.id}: нет в программе`);assert(entry?.title===lesson.title,`${lesson.id}: название расходится с программой`);assert(entry?.eraId===lesson.eraId,`${lesson.id}: эпоха расходится с программой`);assert(entry?.module===lesson.module,`${lesson.id}: модуль расходится с программой`);
 const text=lesson.sections.flatMap(s=>s.paragraphs).join(' ');assert(text.split(/\s+/).length>=350,`${lesson.id}: основной текст короче 350 слов`);assert(!/lorem ipsum|TODO|ЗДЕСЬ ТЕКСТ/i.test(text),`${lesson.id}: найден заполнитель`);
 for(const id of lesson.sources)assert(sources.some(s=>s.id===id),`${lesson.id}: неизвестный источник ${id}`);
 for(const id of lesson.people)assert(people.some(p=>p.id===id),`${lesson.id}: неизвестная личность ${id}`);
 for(const id of lesson.terms)assert(terms.some(t=>t.id===id),`${lesson.id}: неизвестный термин ${id}`);
 for(const id of lesson.mapPoints)assert(places.some(p=>p.id===id),`${lesson.id}: неизвестное место ${id}`);
 for(const q of lesson.questions){assert(q.id.startsWith(lesson.id+'-q'),`${q.id}: неверная принадлежность вопроса`);if(!q.selfAssessed&&q.type!=='text'){assert(q.options&&new Set(q.options).size===q.options.length,`${q.id}: пустые/повторные варианты`);for(const a of q.answer)assert(q.options?.includes(a),`${q.id}: ответ отсутствует среди вариантов`);}if(q.type==='order')assert(q.options?.length===q.answer.length,`${q.id}: порядок неполон`);if(['single','source','cause','map'].includes(q.type))assert(q.answer.length===1,`${q.id}: требуется один ответ`);}
}
for(const p of people)for(const id of p.sources)assert(sources.some(s=>s.id===id),`${p.id}: неизвестный источник ${id}`);
for(const era of eras)assert(lessons.some(l=>l.eraId===era.id),`${era.id}: нет написанных уроков`);
for(const source of sources){const url=new URL(source.url);assert(url.protocol==='https:',`${source.id}: небезопасная ссылка`);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`Контент: ${eras.length} эпох, ${curriculum.length} тем, ${lessons.length} написанных уроков, ${questionIds.length} вопросов, ${terms.length} терминов, ${people.length} персоналий. Ссылки между объектами и структура корректны. Это не историческая экспертиза.`);
