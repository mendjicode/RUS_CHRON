import portraits from '../content/portraits.json';
import {ExternalLink} from 'lucide-react';
export function Portrait({name,compact=false}:{name:string;compact?:boolean}){
 const portrait=portraits.find(p=>p.personName===name);if(!portrait)return null;
 if(compact)return <img className="person-portrait" src={`${import.meta.env.BASE_URL}${portrait.file}`} alt={`${portrait.title}. ${portrait.creator}, ${portrait.date}`} loading="lazy"/>;
 return <figure className="portrait-document"><img src={`${import.meta.env.BASE_URL}${portrait.file}`} alt={portrait.title} loading="lazy"/><figcaption><b>{portrait.creator}. {portrait.title}, {portrait.date}</b><p>{portrait.context}</p><p>{portrait.collection}. {portrait.license}.</p><a className="text-link" href={portrait.url} target="_blank" rel="noreferrer">Карточка изображения<ExternalLink size={13}/></a></figcaption></figure>;
}
