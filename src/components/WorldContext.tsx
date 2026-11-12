import {Link} from 'react-router-dom';
import {ArrowUpRight,Globe2} from 'lucide-react';
import rawContext from '../content/world-context.json';
import {worldContextSchema} from '../content/reference-schema';
import {lessonById} from '../content';
import {VisualSources} from './LearningVisuals';
export const worldContexts=worldContextSchema.array().parse(rawContext);
export function WorldContext({lessonId,eraId='all'}:{lessonId?:string;eraId?:string}){
 const visible=worldContexts.filter(c=>lessonId?c.lessonIds.includes(lessonId):eraId==='all'||c.eraId===eraId);if(!visible.length)return null;
 return <section className="world-context article-section"><span className="mini-label"><Globe2 size={14}/> ОДНО ВРЕМЯ · РАЗНЫЕ СТРАНЫ</span><h2>Россия и мир</h2><p className="muted">Сопоставим события одного года. Совпадение во времени само по себе не доказывает причинной связи.</p><div className="world-context-grid">{visible.map(c=><article className="world-context-card" key={c.id}><strong className="world-context-year">{c.year}</strong><div className="world-context-pair"><div><span className="mini-label">В ИСТОРИИ РОССИИ</span><h3>{c.russia.title}</h3><p>{c.russia.description}</p></div><div><span className="mini-label">В МИРЕ</span><h3>{c.world.title}</h3><p>{c.world.description}</p></div></div><div className="article-callout">{c.connection}</div><div className="related-links">{c.lessonIds.map(id=>lessonById[id]).filter(l=>l!==undefined).map(l=><Link key={l.id} to={`/lesson/${l.id}`}>{l.title}<ArrowUpRight size={12}/></Link>)}</div><VisualSources ids={c.sources}/></article>)}</div></section>;
}
