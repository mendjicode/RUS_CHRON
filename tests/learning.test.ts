import {describe,it,expect} from 'vitest';
import {schedule,checkAnswer,streak,localDay} from '../src/lib/learning';
describe('интервальное повторение',()=>{
 it('назначает 1, затем 3 дня, затем увеличенный интервал',()=>{const now=100000;const a=schedule(undefined,true,now);expect(a.due).toBe(now+86400000);const b=schedule(a,true,now);expect(b.interval).toBe(3);expect(schedule(b,true,now).interval).toBe(7);});
 it('возвращает ошибку через 10 минут и сбрасывает серию',()=>{const previous={due:1,interval:40,repetitions:7,lastCorrect:true};const next=schedule(previous,false,1000);expect(next).toEqual({due:601000,interval:0,repetitions:0,lastCorrect:false});});
 it('ограничивает длинные интервалы 90 днями',()=>expect(schedule({due:1,interval:90,repetitions:10,lastCorrect:true},true,0).interval).toBe(90));
});
describe('проверка ответов',()=>{
 it('для множественного выбора требует точного множества',()=>{expect(checkAnswer('multiple',['б','а'],['а','б'])).toBe(true);expect(checkAnswer('multiple',['а'],['а','б'])).toBe(false);expect(checkAnswer('multiple',['а','б','в'],['а','б'])).toBe(false);});
 it('для хронологии сохраняет значение порядка',()=>{expect(checkAnswer('order',['Рязань','Киев'],['Рязань','Киев'])).toBe(true);expect(checkAnswer('order',['Киев','Рязань'],['Рязань','Киев'])).toBe(false);});
 it('не принимает лишний или пустой ответ',()=>{expect(checkAnswer('single',[],['Москва'])).toBe(false);expect(checkAnswer('single',['Москва','Киев'],['Москва'])).toBe(false);});
});
describe('серия занятий',()=>{
 it('принимает вчерашнюю серию до первого занятия сегодня',()=>{const date=new Date(2026,10,10,14);expect(streak(['2026-11-08','2026-11-09'],date)).toBe(2);expect(streak(['2026-11-08'],date)).toBe(0);});
 it('считает текущий день и переход месяца',()=>expect(streak(['2026-10-31','2026-11-01'],new Date(2026,10,1,14))).toBe(2));
 it('использует локальную календарную дату',()=>expect(localDay(new Date(2026,0,3,9))).toBe('2026-01-03'));
});
