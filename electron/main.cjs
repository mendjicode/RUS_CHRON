const {app,BrowserWindow,session,shell}=require('electron');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../dist');
const {atlasImagePath}=require('./local-assets.cjs');
const smoke=process.argv.includes('--smoke-test');
if(smoke){
  const fs=require('node:fs');const os=require('node:os');
  app.setPath('userData',fs.mkdtempSync(path.join(os.tmpdir(),'rus-chron-smoke-')));
  app.disableHardwareAcceleration();
}
app.whenReady().then(()=>{
  const win=new BrowserWindow({width:1440,height:960,minWidth:780,minHeight:600,show:!smoke,backgroundColor:'#f8f7f3',title:'Хроники России',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
  const openHandler=({url})=>{
    if(atlasImagePath(url,root))return {action:'allow',overrideBrowserWindowOptions:{width:1200,height:900,show:!smoke,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}}};
    if(/^https:\/\//.test(url))shell.openExternal(url);return {action:'deny'};
  };
  win.webContents.setWindowOpenHandler(openHandler);
  win.webContents.on('did-create-window',child=>{
    child.webContents.setWindowOpenHandler(()=>({action:'deny'}));
    child.webContents.on('will-navigate',(event,url)=>{if(!atlasImagePath(url,root)){event.preventDefault();if(/^https:\/\//.test(url))shell.openExternal(url);}});
  });
  win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith(pathToFileURL(root).href+'/')){event.preventDefault();if(/^https:\/\//.test(url))shell.openExternal(url);}});
  session.defaultSession.webRequest.onHeadersReceived((details,callback)=>callback({responseHeaders:{...details.responseHeaders,'Content-Security-Policy':["default-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'"]}}));
  win.loadFile(path.join(root,'index.html'));
  if(smoke)require('./smoke.cjs').runSmoke(app,win);
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
