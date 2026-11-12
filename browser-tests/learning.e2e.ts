import {readFileSync} from 'node:fs';
const curriculum=JSON.parse(readFileSync(new URL('../src/content/curriculum.json',import.meta.url),'utf8')) as {id:string}[];
import {test,expect} from '@playwright/test';
test('следующий урок начинается с начала, а пропуск проверяет введённое слово',async({page})=>{
 await page.goto('/#/lesson/01-001');await expect(page.locator('h1')).toBeVisible();await page.getByRole('link',{name:'Следующий написанный урок',exact:true}).click();await expect(page.locator('h1')).toHaveText('Исторические источники');await page.waitForFunction(()=>window.scrollY===0);
 await page.goto('/#/lesson/06-024');await page.getByRole('button',{name:'Начать проверку',exact:true}).click();const card=page.locator('.question-card').filter({has:page.getByRole('textbox',{name:'Ответ в пропуск'})});await card.getByRole('textbox',{name:'Ответ в пропуск'}).fill('табель');await card.getByRole('button',{name:'Проверить ответ',exact:true}).click();await expect(card.getByText('Верно. Вы поняли главное.',{exact:true})).toBeVisible();
});
test('полная программа связана с уроками, справочником и мировым контекстом',async({page})=>{
 test.setTimeout(180000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#/course');await expect(page.getByRole('heading',{name:'Мой курс',exact:true})).toBeVisible();
 // Capture the actual links rendered by this production build, including late eras.
 const links=await page.locator('a[href^="#/lesson/"]').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.getAttribute('href')!))]);
 expect(links).toHaveLength(curriculum.length);
 for(const hash of links){await page.goto('/'+hash);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.lesson-article')).toBeVisible();}
 await page.goto('/#/people?person=catherine2');await expect(page.getByRole('dialog')).toContainText('Екатерина II');await expect(page.locator('.portrait-document img')).toBeVisible();await page.getByRole('button',{name:'Закрыть биографию'}).click();
 await page.goto('/#/timeline');await page.getByText('Сравнить события: Россия и мир',{exact:true}).click();await expect(page.getByRole('heading',{name:'Россия и мир',exact:true})).toBeVisible();await expect(page.locator('.world-context-card')).toHaveCount(15);
 expect(errors).toEqual([]);
});
test('чтение, заметка, закладка и завершение переживают перезагрузку',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#/lesson/01-001');await expect(page.getByRole('heading',{name:'Что изучает история и как работают историки',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Сохранить закладку'}).click();await expect(page.getByRole('button',{name:'Сохранить закладку'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Мои заметки',exact:true}).click();await page.getByRole('textbox',{name:'Заметка к уроку'}).fill('Проверить происхождение свидетельства и дату.');
 await page.getByRole('button',{name:'Отметить изученным',exact:true}).click();await expect(page.getByRole('button',{name:'Урок отмечен изученным'})).toBeDisabled();
 await page.reload();await page.getByRole('button',{name:'Мои заметки',exact:true}).click();await expect(page.getByRole('textbox',{name:'Заметка к уроку'})).toHaveValue('Проверить происхождение свидетельства и дату.');await expect(page.getByRole('button',{name:'Сохранить закладку'})).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('button',{name:'Урок отмечен изученным'})).toBeDisabled();
 await page.getByRole('button',{name:'Объясни очень просто',exact:true}).click();await expect(page.getByRole('heading',{name:'Начнём с главного'})).toBeVisible();await page.getByRole('button',{name:'Глубокое погружение',exact:true}).click();await expect(page.getByRole('heading',{name:'Можно ли написать окончательную историю?'})).toBeVisible();expect(errors).toEqual([]);
});
test('производственная сборка открывает другой урок, словарь и карту без сети',async({page,context})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await expect(page.getByRole('heading',{name:/Большая история/})).toBeVisible();await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.goto('/#/lesson/02-009');await expect(page.getByRole('heading',{name:'Крещение Руси',exact:true,level:1})).toBeVisible();await expect(page.getByRole('img',{name:/Географическая карта/})).toBeAttached();await page.goto('/#/dictionary');await expect(page.getByRole('heading',{name:'Исторический словарь',exact:true})).toBeVisible();await page.goto('/#/atlas');await expect(page.getByRole('heading',{name:'Исторический атлас',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Киев',exact:true})).toBeAttached();await page.getByRole('button',{name:'Киев',exact:true}).click();await expect(page.getByRole('heading',{name:'Киев',exact:true})).toBeVisible();expect(errors).toEqual([]);
});
test('узкий экран, тёмная тема и глобальный поиск',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByRole('heading',{name:/Большая история/})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:testInfo.outputPath('mobile-home.png'),fullPage:true});await page.getByRole('button',{name:'Открыть меню',exact:true}).click();await page.getByRole('link',{name:'Настройки',exact:true}).click();await page.getByRole('button',{name:'Тёмная',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.getByRole('textbox',{name:'Глобальный поиск'}).fill('988');await page.getByRole('button',{name:'Урок: Крещение Руси',exact:true}).click();await expect(page.getByRole('heading',{name:'Крещение Руси',exact:true,level:1})).toBeVisible();expect(errors).toEqual([]);
});
test('главная на широком экране и итоговая проверка эпохи',async({page},testInfo)=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:/Большая история/})).toBeVisible();await page.screenshot({path:testInfo.outputPath('desktop-home.png'),fullPage:true});await page.goto('/#/practice');await page.getByRole('button',{name:/Итоговая проверка эпохи/}).click();await page.getByRole('combobox',{name:'Историческая эпоха'}).selectOption('era-02');await page.getByRole('button',{name:'Начать тренировку',exact:true}).click();await expect(page.getByText(/Итог эпохи/)).toBeVisible();await expect(page.locator('.session-top')).toContainText('Задание 1 из');await expect(page.locator('.question-card')).toBeVisible();
});
