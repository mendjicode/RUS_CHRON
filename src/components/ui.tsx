import type {ReactNode} from 'react';
import {ArrowUpRight,ArrowRight} from 'lucide-react';
import {Link} from 'react-router-dom';
export function PageHeading({eyebrow,title,description,children}:{eyebrow:string;title:string;description?:string;children?:ReactNode}){return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description&&<p className="lead">{description}</p>}</div>{children}</div>;}
export function SectionHeading({title,to,label='Смотреть всё'}:{title:string;to?:string;label?:string}){return <div className="section-heading"><h2>{title}</h2>{to&&<Link to={to} className="text-link">{label}<ArrowUpRight size={16}/></Link>}</div>;}
export function Empty({title,children}:{title:string;children:ReactNode}){return <div className="empty"><span className="empty-mark">✧</span><h3>{title}</h3><p>{children}</p></div>;}
export function ProgressBar({value,label}:{value:number;label?:string}){return <div className="progress-wrap">{label&&<div className="progress-label"><span>{label}</span><b>{Math.round(value)}%</b></div>}<div className="progress" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${value}%`}}/></div></div>;}
export function LinkButton({to,children,secondary=false}:{to:string;children:ReactNode;secondary?:boolean}){return <Link className={`button ${secondary?'secondary':''}`} to={to}>{children}<ArrowRight size={17}/></Link>;}
export const roman=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
