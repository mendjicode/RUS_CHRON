import 'fake-indexeddb/auto';
import {beforeEach,it,expect} from 'vitest';
import {backupSchema,useStore,exportProgress} from '../src/lib/store';
import {lessons,events} from '../src/content';
beforeEach(()=>useStore.getState().reset());
it('импорт старой копииv1 заполняет только новые поля и сохраняет прежние',()=>{useStore.getState().note(lessons[0].id,'Сохранённая мысль');const {favoriteEvents,readingDetails,...oldCopy}=exportProgress();const parsed=backupSchema.parse(oldCopy);expect(parsed.favoriteEvents).toEqual([]);expect(parsed.readingDetails).toEqual({});useStore.getState().reset();useStore.getState().importData(oldCopy);expect(useStore.getState().notes[lessons[0].id]).toBe('Сохранённая мысль');});
it('избранное событие хранится отдельно от закладки урока',()=>{const event=events[0];useStore.getState().favoriteEvent(event.id);expect(useStore.getState().favoriteEvents).toEqual([event.id]);expect(useStore.getState().bookmarks).toEqual([]);const copy=exportProgress();useStore.getState().reset();useStore.getState().importData(copy);expect(useStore.getState().favoriteEvents).toEqual([event.id]);});
it('неизвестное избранное событие отклоняется до изменения сохранения',()=>{const copy={...exportProgress(),favoriteEvents:['does-not-exist']};expect(()=>useStore.getState().importData(copy)).toThrow();expect(useStore.getState().favoriteEvents).toEqual([]);});
it('каждый уровень чтения сохраняет собственное положение',()=>{const id=lessons[0].id;useStore.getState().readPosition(id,'detail',.7);useStore.getState().readPosition(id,'simple',.2);expect(useStore.getState().reading[id]).toBe(.7);expect(useStore.getState().readingDetails[id]).toEqual({detail:.7,simple:.2,lastLevel:'simple'});});
