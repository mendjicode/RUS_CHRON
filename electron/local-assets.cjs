const path=require('node:path');
const {fileURLToPath}=require('node:url');
exports.atlasImagePath=(url,root)=>{
 try{
  const parsed=new URL(url);if(parsed.protocol!=='file:')return null;
  const file=fileURLToPath(parsed);const relative=path.relative(path.join(root,'assets','atlas'),file);
  return relative&&!relative.startsWith('..')&&!path.isAbsolute(relative)&&/\.(?:png|jpe?g)$/i.test(file)?file:null;
 }catch{return null;}
};
