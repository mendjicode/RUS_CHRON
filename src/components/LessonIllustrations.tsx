import illustrations from '../content/illustrations.json';
import {ExternalLink} from 'lucide-react';
export function LessonIllustrations({lessonId}:{lessonId:string}){
 return <>{illustrations.filter(i=>i.lessonIds.includes(lessonId)).map(i=><section className="article-section" key={i.id}><span className="mini-label">ИЗОБРАЖЕНИЕ КАК ИСТОЧНИК</span><h2>{i.title}</h2><figure className="lesson-document"><img src={`${import.meta.env.BASE_URL}${i.file}`} alt={i.title} loading="lazy"/><figcaption><b>{i.author}</b><p>{i.date}. {i.license}.</p><p>{i.context}</p><a className="text-link" href={i.url} target="_blank" rel="noreferrer">Происхождение изображения<ExternalLink size={13}/></a></figcaption></figure><div className="article-callout"><b>Рассмотрите документ</b><p>{i.question}</p></div></section>)}</>;
}
