export type Review={due:number;interval:number;repetitions:number;lastCorrect:boolean};
const DAY=86400000;
export function schedule(previous:Review|undefined,correct:boolean,now=Date.now()):Review{
 const repetitions=correct?(previous?.repetitions??0)+1:0;
 const interval=correct?(repetitions===1?1:repetitions===2?3:Math.min(90,Math.round((previous?.interval??3)*2.2))):0;
 return {due:now+(correct?interval*DAY:10*60000),interval,repetitions,lastCorrect:correct};
}
export function checkAnswer(type:string,answer:string[],expected:string[]):boolean{
 const normalize=(s:string)=>s.trim().toLocaleLowerCase('ru').replace(/ё/g,'е');
 if(type==='multiple')return answer.length===expected.length&&expected.every(x=>answer.map(normalize).includes(normalize(x)));
 return answer.length===expected.length&&answer.every((x,i)=>normalize(x)===normalize(expected[i]));
}
export const localDay=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function streak(days:string[],today=new Date()):number{
 let count=0; const date=new Date(today);date.setHours(12,0,0,0);
 if(!days.includes(localDay(date)))date.setDate(date.getDate()-1);
 while(days.includes(localDay(date))){count++;date.setDate(date.getDate()-1);}
 return count;
}
