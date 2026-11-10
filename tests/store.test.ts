import 'fake-indexeddb/auto';
import {beforeEach,describe,it,expect,vi} from 'vitest';
import {get} from 'idb-keyval';
import {useStore,exportProgress,backupSchema} from '../src/lib/store';
import {lessons} from '../src/content';
const first=lessons[0];
const waitForWrite=()=>new Promise(resolve=>setTimeout(resolve,30));
beforeEach(async()=>{useStore.getState().reset();await waitForWrite();});
describe('локальные учебные данные',()=>{
 it('открывает новый профиль без ложной ошибки повреждения',async()=>{await useStore.persist.clearStorage();await useStore.persist.rehydrate();expect(useStore.getState().storageError).toBe('');});
 it('завершение идемпотентно и не принимает неизвестный урок',()=>{useStore.getState().complete(first.id);useStore.getState().complete(first.id);useStore.getState().complete('invalid');expect(useStore.getState().completed).toEqual([first.id]);});
 it('сохраняет кириллицу, заметки, прогресс и историю в IndexedDB',async()=>{const s=useStore.getState();s.complete(first.id);s.note(first.id,'Почему летопись нуждается в проверке?');s.answer(first.questions[0].id,false);s.tick(45);await waitForWrite();const saved=JSON.parse((await get<string>('rus-chron-progress-v1'))!);expect(saved.state.notes[first.id]).toContain('летопись');expect(saved.state.completed).toEqual([first.id]);expect(saved.state.studySeconds).toBe(45);expect(saved.state.reviews[first.questions[0].id].lastCorrect).toBe(false);});
 it('может восстановить данные новым экземпляром хранилища',async()=>{useStore.getState().complete(first.id);useStore.getState().bookmark(first.id);await waitForWrite();vi.resetModules();const fresh=await import('../src/lib/store');await fresh.useStore.persist.rehydrate();expect(fresh.useStore.getState().completed).toEqual([first.id]);expect(fresh.useStore.getState().bookmarks).toEqual([first.id]);});
 it('экспорт и импорт сохраняют данные без функций',()=>{useStore.getState().note(first.id,'Собственная мысль');const copy=JSON.parse(JSON.stringify(exportProgress()));expect(copy.note).toBeUndefined();useStore.getState().reset();useStore.getState().importData(copy);expect(useStore.getState().notes[first.id]).toBe('Собственная мысль');});
 it('отвергает повреждённую копию до изменения данных',()=>{useStore.getState().complete(first.id);expect(()=>useStore.getState().importData({version:2})).toThrow();expect(useStore.getState().completed).toEqual([first.id]);});
 it('отвергает неизвестные ID в корректной по форме копии',()=>{const copy=exportProgress();copy.completed=['99-999'];expect(()=>useStore.getState().importData(copy)).toThrow(/неизвестные/);expect(useStore.getState().completed).toEqual([]);});
 it('ограничивает размер шрифта и некорректные числовые данные при импорте',()=>{expect(backupSchema.safeParse({...exportProgress(),fontScale:10}).success).toBe(false);expect(backupSchema.safeParse({...exportProgress(),studySeconds:-1}).success).toBe(false);});
});
