import {describe,it,expect} from 'vitest';
import {courseModules} from '../src/content/modules';
import {curriculum,questions} from '../src/content';
import {selectExam} from '../src/lib/exams';
import {checkAnswer} from '../src/lib/learning';
describe('смысловая программа и итоговые задания',()=>{
 it('каждая тема относится ровно к одному смысловому модулю',()=>{const ids=courseModules.flatMap(m=>m.lessonIds);expect(new Set(ids).size).toBe(ids.length);expect([...ids].sort()).toEqual(curriculum.map(l=>l.id).sort());});
 it('экзамен распределяет первый круг по разным урокам и не изменяет исходный банк',()=>{const available=questions.filter(q=>q.eraId==='era-02');const snapshot=available.map(q=>q.id);const exam=selectExam(available,'era-02',20,()=>.4);expect(exam.length).toBe(Math.min(20,available.length));expect(new Set(exam.map(q=>q.id)).size).toBe(exam.length);expect(exam.every(q=>q.eraId==='era-02')).toBe(true);const count=new Set(available.map(q=>q.lessonId)).size;expect(new Set(exam.slice(0,Math.min(count,20)).map(q=>q.lessonId)).size).toBe(Math.min(count,20));expect(available.map(q=>q.id)).toEqual(snapshot);});
 it('пустая эпоха не создаёт фиктивных заданий',()=>expect(selectExam(questions,'unknown')).toEqual([]));
 it('пропуск проверяется по нормализованному точному ответу',()=>{expect(checkAnswer('fill',['  НЭП '],['нэп'])).toBe(true);expect(checkAnswer('fill',['новая политика'],['нэп'])).toBe(false);});
});
