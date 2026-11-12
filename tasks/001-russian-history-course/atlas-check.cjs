// Run from repository root against the production preview at ATLAS_BASE_URL.
const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'ru-RU'});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.ATLAS_BASE_URL||'http://127.0.0.1:4174';
 const output='tasks/001-russian-history-course';
 await page.goto(`${base}/#/atlas`);
 await expect(page.getByRole('heading',{name:'Исторический атлас',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Киев',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Киев',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Приблизить карту',exact:true}).first().click();
 await page.getByRole('button',{name:'Сбросить положение карты',exact:true}).first().click();
 // Wait for precache before going offline. New sheet selection must still load.
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);
 const ids=await page.locator('#atlas-sheet-select option').evaluateAll(options=>options.map(o=>o.value));
 expect(ids).toHaveLength(7);
 for(const id of ids){
  await page.getByLabel('Выберите исторический лист').selectOption(id);
  const href=await page.locator('.atlas-scan image').getAttribute('href');
  const dimensions=await page.evaluate(async src=>{const image=new Image();image.src=src;await image.decode();return [image.naturalWidth,image.naturalHeight];},href);
  expect(dimensions[0]).toBeGreaterThan(1000);expect(dimensions[1]).toBeGreaterThan(800);
 }
 await page.getByLabel('Выберите исторический лист').selectOption('minard-1812');
 await page.getByRole('button',{name:'Приблизить исторический лист',exact:true}).click();
 await expect(page.locator('.atlas-scan-hint')).toContainText('150%');
 const scan=page.locator('.atlas-scan');await scan.focus();
 const originalTransform=await scan.locator('image').getAttribute('transform');
 await scan.press('ArrowRight');expect(await scan.locator('image').getAttribute('transform')).not.toEqual(originalTransform);
 await scan.press('Home');await expect(page.locator('.atlas-scan-hint')).toContainText('100%');
 const box=await scan.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+50,box.y+box.height/2+30);await page.mouse.up();expect(await scan.locator('image').getAttribute('transform')).not.toEqual('translate(0,0) scale(1)');
 await page.getByLabel('Выберите событие').selectOption('1812');
 await expect(page.locator('.atlas-stage h3')).toHaveText('Переправа через Неман');
 await page.getByRole('button',{name:'Следующий этап',exact:true}).click();
 await expect(page.locator('.atlas-stage h3')).toHaveText('Бои за Смоленск');
 await expect(page.locator('.atlas-campaign .map-place.selected')).toHaveAttribute('aria-label','Смоленск');
 await page.getByRole('button',{name:'Показать этапы автоматически',exact:true}).click();
 await expect(page.locator('.atlas-stage h3')).toHaveText('Бородинское сражение',{timeout:7000});
 await page.getByRole('button',{name:'Остановить показ этапов',exact:true}).click();
 const sourceLinks=await page.locator('.atlas-stage-sources a').evaluateAll(links=>links.map(l=>l.href));expect(sourceLinks.length).toBeGreaterThan(0);expect(sourceLinks.every(url=>url.startsWith('https://'))).toBe(true);
 await page.getByRole('link',{name:'Перейти к уроку о событии'}).click();
 await expect(page.getByRole('heading',{name:'Отечественная война 1812 года',exact:true,level:1})).toBeVisible();
 await page.goto(`${base}/#/atlas?era=era-06`);
 await expect(page.getByLabel('Выберите исторический лист')).toHaveValue('baltic-1701');
 await page.getByLabel('Выберите исторический лист').selectOption('baltic-1701');
 await page.screenshot({path:path.join(output,'atlas-verified-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>document.documentElement.dataset.theme='dark');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByLabel('Выберите исторический лист').selectOption('medieval-commerce');
 await page.screenshot({path:path.join(output,'atlas-verified-mobile-dark.png'),fullPage:true});
 await page.goto(`${base}/#/atlas?era=era-09`);
 await expect(page.getByLabel('Выберите исторический лист')).toHaveValue('ussr-1989');
 await expect(page.getByLabel('Выберите событие')).toHaveValue('stalingrad');
 await page.getByRole('button',{name:'Следующий этап',exact:true}).click();await expect(page.locator('.atlas-stage h3')).toHaveText('Операция «Уран»');
 expect(errors).toEqual([]);
 fs.writeFileSync(path.join(output,'atlas-browser-result.json'),JSON.stringify({checkedAt:new Date().toISOString(),sheets:ids,offline:true,keyboardPan:true,pointerPan:true,automaticStages:true,lessonLink:true,mobileDarkNoOverflow:true,pageErrors:errors},null,2)+'\n');
 console.log('PASS: 7 local sheets offline; original Kyiv/zoom; scan zoom and keyboard/pointer pan; campaign stages and automatic playback; lesson link; era defaults; mobile dark without overflow; no page errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
