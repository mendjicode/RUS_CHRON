export function prepareOrder(options:readonly string[],answer:readonly string[],random:()=>number=Math.random):string[]{
 const result=[...options];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 if(result.length>1&&result.every((item,i)=>item===answer[i]))[result[0],result[1]]=[result[1],result[0]];
 return result;
}
