const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const http=require('node:http');
(async()=>{const server=http.createServer((req,res)=>{if(req.url!=='/icon.svg'){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':'image/svg+xml'}).end(fs.readFileSync('public/icon.svg'));});await new Promise(resolve=>server.listen(4176,'127.0.0.1',resolve));const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',headless:true});try{const page=await browser.newPage({viewport:{width:512,height:512},deviceScaleFactor:1});await page.goto('http://127.0.0.1:4176/icon.svg');await page.locator('svg').screenshot({path:'build/icon.png',omitBackground:true});}finally{await browser.close();server.close();}})();
