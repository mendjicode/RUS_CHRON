import type {Question} from '../content/schema';
export type ExamQuestion=Question&{lessonId:string;lessonTitle:string;eraId:string};
/** Round-robin prevents a long lesson from taking over an epoch's assessment. */
export function selectExam(pool:ExamQuestion[],eraId:string,limit=20,random:()=>number=Math.random):ExamQuestion[]{
 const byLesson=new Map<string,ExamQuestion[]>();
 for(const q of pool)if(eraId==='all'||q.eraId===eraId){const list=byLesson.get(q.lessonId)??[];list.push(q);byLesson.set(q.lessonId,list);}
 const shuffle=<T,>(xs:T[])=>{for(let i=xs.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[xs[i],xs[j]]=[xs[j],xs[i]];}return xs;};
 const queues=shuffle([...byLesson.values()].map(v=>shuffle([...v])));const selected:ExamQuestion[]=[];
 while(selected.length<limit&&queues.some(q=>q.length))for(const queue of queues){const q=queue.shift();if(q)selected.push(q);if(selected.length===limit)break;}
 return selected;
}
