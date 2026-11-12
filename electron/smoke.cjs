// Explicit CI-only launch flag; uses a fresh local profile, never a learner's data.
const fs=require('node:fs');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
exports.runSmoke=async(app,win)=>{
 const errors=[];win.webContents.on('render-process-gone',(_,details)=>errors.push(details.reason));
 const report={platform:process.platform,checks:[],errors};
 const target=process.argv.find(arg=>arg.startsWith('--smoke-report='))?.slice('--smoke-report='.length);
 const finish=(code)=>{if(target)fs.writeFileSync(target,JSON.stringify(report,null,2));app.exit(code);};
 const deadline=setTimeout(()=>{errors.push('Desktop smoke timed out');finish(1);},45000);
 const js=code=>win.webContents.executeJavaScript(code);
 const until=async(code)=>{for(let n=0;n<100;n++){if(await js(code))return;await delay(150);}throw new Error(`Renderer condition failed: ${code}`);};
 try{
  if(win.webContents.isLoading())await new Promise(resolve=>win.webContents.once('did-finish-load',resolve));
  await until("document.querySelector('h1')?.textContent.includes('Большая история')");report.checks.push('local dashboard rendered');
  await js("location.hash='/lesson/02-009'");
  await until("document.querySelector('h1')?.textContent==='Крещение Руси'");report.checks.push('offline local lesson rendered');
  const openNotes="Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Мои заметки')?.click()";
  await js(openNotes);await until("!!document.querySelector('textarea[aria-label=\"Заметка к уроку\"]')");
  await js(`(()=>{const el=document.querySelector('textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,'Desktop smoke: заметка');el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await delay(900);win.webContents.reload();await new Promise(resolve=>win.webContents.once('did-finish-load',resolve));
  await until("document.querySelector('h1')?.textContent==='Крещение Руси'");await js(openNotes);
  await until("document.querySelector('textarea')?.value==='Desktop smoke: заметка'");report.checks.push('IndexedDB note survives renderer reload');
  await js("location.hash='/atlas'");await until("!!document.querySelector('.atlas-document-heading a')");
  const opened=new Promise(resolve=>win.webContents.once('did-create-window',resolve));
  await js("document.querySelector('.atlas-document-heading a').click()");const sheet=await opened;
  if(sheet.webContents.isLoading())await new Promise(resolve=>sheet.webContents.once('did-finish-load',resolve));
  let imageReady=false;for(let n=0;n<100;n++){imageReady=await sheet.webContents.executeJavaScript("!!document.querySelector('img')?.naturalWidth");if(imageReady)break;await delay(100);}
  if(!imageReady)throw new Error('Local atlas sheet did not render');report.checks.push('full local atlas sheet opens in sandboxed window');sheet.close();
  if(errors.length)throw new Error('Renderer failed');clearTimeout(deadline);finish(0);
 }catch(error){clearTimeout(deadline);errors.push(String(error));finish(1);}
};
