import {describe,it,expect} from 'vitest';
import {prepareOrder} from '../src/lib/exercises';
import {questions} from '../src/content';
describe('исходная последовательность в хронологических заданиях',()=>{
 it('не оставляет заранее решённое задание при любом крайним выборе генератора',()=>{for(const random of [()=>0,()=>.999999]){const answer=['A','B','C'];const result=prepareOrder(answer,answer,random);expect([...result].sort()).toEqual([...answer].sort());expect(result).not.toEqual(answer);expect(answer).toEqual(['A','B','C']);}});
 it('каждое настоящее хронологическое задание требует изменения порядка',()=>{for(const q of questions.filter(q=>q.type==='order')){const before=[...q.options!];const result=prepareOrder(before,q.answer,()=>.999999);expect(result).not.toEqual(q.answer);expect([...result].sort()).toEqual([...before].sort());expect(q.options).toEqual(before);}});
});
