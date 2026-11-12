import {it,expect,vi} from 'vitest';
it('ошибка сохранения показывает сообщение без бесконечного повторения записи',async()=>{
 let calls=0;vi.doMock('idb-keyval',()=>({get:async()=>null,set:async()=>{calls++;throw new Error('QuotaExceededError');},del:async()=>{}}));
 try{vi.resetModules();const {useStore}=await import('../src/lib/store');useStore.getState().tick(15);await new Promise(r=>setTimeout(r,30));expect(useStore.getState().storageError).toContain('Не удалось сохранить данные');expect(calls).toBe(2);}finally{vi.doUnmock('idb-keyval');vi.resetModules();}
});
