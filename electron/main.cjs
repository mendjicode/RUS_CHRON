const {app,BrowserWindow,session,shell}=require('electron');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'../dist');
app.whenReady().then(()=>{
  const win=new BrowserWindow({width:1440,height:960,minWidth:780,minHeight:600,backgroundColor:'#f8f7f3',title:'Хроники России',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\//.test(url))shell.openExternal(url);return {action:'deny'};});
  win.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith(pathToFileURL(root).href+'/')){event.preventDefault();if(/^https:\/\//.test(url))shell.openExternal(url);}});
  session.defaultSession.webRequest.onHeadersReceived((details,callback)=>callback({responseHeaders:{...details.responseHeaders,'Content-Security-Policy':["default-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'"]}}));
  win.loadFile(path.join(root,'index.html'));
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
