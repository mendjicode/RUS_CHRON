import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeft,ArrowRight,ExternalLink,Minus,Pause,Play,Plus,RotateCcw} from 'lucide-react';
import {atlasCampaigns,atlasSheets,type AtlasSheet,type AtlasCampaign} from '../content/atlas';
import {curriculum} from '../content';
import atlasSources from '../content/source-packs/atlas.json';
import {HistoricalMap} from './HistoricalMap';
import './atlas.css';

function SheetViewer({sheet}:{sheet:AtlasSheet}){
 const [zoom,setZoom]=useState(1);
 const [pan,setPan]=useState<[number,number]>([0,0]);
 const [drag,setDrag]=useState<{x:number;y:number;pan:[number,number]}|null>(null);
 const ratio=sheet.height/sheet.width;
 const source=`${import.meta.env.BASE_URL}assets/atlas/${sheet.file}`;
 const reset=()=>{setZoom(1);setPan([0,0]);};
 return <article className="atlas-sheet">
  <div className="atlas-document-heading"><div><span className="mini-label">ИСТОРИЧЕСКИЙ ЛИСТ · {sheet.period}</span><h3>{sheet.title}</h3></div><a href={source} target="_blank" rel="noreferrer">Полный лист <ExternalLink size={14}/></a></div>
  <div className="atlas-scan-frame">
   <svg viewBox={`0 0 1000 ${1000*ratio}`} className="atlas-scan" role="img" aria-label={`Историческая карта: ${sheet.title}. ${sheet.author}. ${sheet.published}`} tabIndex={0}
    onKeyDown={e=>{const arrows:Record<string,[number,number]>={ArrowLeft:[35,0],ArrowRight:[-35,0],ArrowUp:[0,35],ArrowDown:[0,-35]};if(arrows[e.key]){e.preventDefault();const delta=arrows[e.key];setPan(p=>[p[0]+delta[0],p[1]+delta[1]]);}else if(e.key==='Home'){e.preventDefault();reset();}}}
    onPointerDown={e=>{if(e.button===0){e.currentTarget.setPointerCapture(e.pointerId);setDrag({x:e.clientX,y:e.clientY,pan});}}}
    onPointerMove={e=>{if(drag){const scale=1000/e.currentTarget.getBoundingClientRect().width;setPan([drag.pan[0]+(e.clientX-drag.x)*scale,drag.pan[1]+(e.clientY-drag.y)*scale]);}}}
    onPointerUp={()=>setDrag(null)} onPointerCancel={()=>setDrag(null)}>
    <title>{sheet.title}</title><desc>{sheet.interpretation}</desc>
    <image href={source} width="1000" height={1000*ratio} transform={`translate(${pan[0]+500*(1-zoom)},${pan[1]+500*ratio*(1-zoom)}) scale(${zoom})`}/>
   </svg>
   <div className="map-controls atlas-scan-controls"><button className="icon-button" aria-label="Приблизить исторический лист" disabled={zoom>=5} onClick={()=>setZoom(z=>Math.min(5,z+.5))}><Plus size={19}/></button><button className="icon-button" aria-label="Отдалить исторический лист" disabled={zoom<=1} onClick={()=>setZoom(z=>Math.max(1,z-.5))}><Minus size={19}/></button><button className="icon-button" aria-label="Сбросить исторический лист" onClick={reset}><RotateCcw size={17}/></button></div>
  </div>
  <p className="atlas-scan-hint">Масштаб {Math.round(zoom*100)}% · Перетаскивайте лист. С клавиатуры: стрелки перемещают, Home возвращает исходное положение.</p>
  <div className="atlas-document-notes"><div><h4>Как читать карту</h4><ul>{sheet.legend.map(item=><li key={item}>{item}</li>)}</ul><p><b>Для размышления.</b> {sheet.question}</p></div><div><h4>Происхождение и пределы</h4><p>{sheet.interpretation}</p><p><b>{sheet.author}</b><br/>{sheet.published}</p><p>Скан: {sheet.id==='minard-1812'?'Wikimedia Commons':'University of Texas Libraries, Perry–Castañeda Map Collection'}. <a href={sheet.sourceUrl} target="_blank" rel="noreferrer">Каталог источника</a> · <a href={sheet.licenseUrl} target="_blank" rel="noreferrer">{sheet.license}</a>. Получен и визуально сверен 12.11.2026.</p></div></div>
  <div className="atlas-document-links">{sheet.lessonIds.map(id=><Link key={id} to={`/lesson/${id}`}>{curriculum.find(l=>l.id===id)?.title??`Урок ${id}`}<ArrowRight size={14}/></Link>)}</div>
 </article>;
}

export function AtlasDocumentLibrary({eraId}:{eraId:string}){
 const recommended=atlasSheets.filter(s=>s.eraIds.includes(eraId));
 const [selected,setSelected]=useState(recommended[0]?.id??atlasSheets[0].id);
 const sheet=atlasSheets.find(s=>s.id===selected)??atlasSheets[0];
 return <section className="atlas-documents" aria-labelledby="atlas-documents-title"><span className="mini-label">ГРАНИЦЫ И НАПРАВЛЕНИЯ В ИСТОЧНИКАХ</span><h2 id="atlas-documents-title">Исторические карты</h2><p className="muted">Локальные сканы с оригинальными границами и легендами. Подписи оставлены на языке издания; пояснения помогают отличить документ эпохи от поздней реконструкции.</p><label className="atlas-select-label" htmlFor="atlas-sheet-select">Выберите исторический лист</label><select id="atlas-sheet-select" className="atlas-select" value={selected} onChange={e=>setSelected(e.target.value)}>{atlasSheets.map(s=><option value={s.id} key={s.id}>{s.eraIds.includes(eraId)?'Для этой эпохи · ':''}{s.title} ({s.period})</option>)}</select><SheetViewer key={sheet.id} sheet={sheet}/></section>;
}

function CampaignPlayer({campaign}:{campaign:AtlasCampaign}){
 const [step,setStep]=useState(0);const [playing,setPlaying]=useState(false);
 const current=campaign.steps[step];
 useEffect(()=>{if(!playing)return;const timer=window.setInterval(()=>setStep(s=>{if(s>=campaign.steps.length-1){setPlaying(false);return s;}return s+1;}),4500);return()=>window.clearInterval(timer);},[playing,campaign.steps.length]);
 const move=(next:number)=>{setPlaying(false);setStep(next);};
 return <div className="atlas-campaign"><p>{campaign.note}</p><HistoricalMap pointIds={[...new Set(campaign.steps.map(s=>s.placeId))]} activePointId={current.placeId}/><div className="atlas-campaign-controls"><button onClick={()=>move(Math.max(0,step-1))} disabled={step===0} aria-label="Предыдущий этап"><ArrowLeft size={16}/>Назад</button><button onClick={()=>{if(!playing&&step===campaign.steps.length-1)setStep(0);setPlaying(p=>!p);}} aria-label={playing?'Остановить показ этапов':'Показать этапы автоматически'}>{playing?<Pause size={16}/>:<Play size={16}/>} {playing?'Пауза':'По порядку'}</button><button onClick={()=>move(Math.min(campaign.steps.length-1,step+1))} disabled={step===campaign.steps.length-1} aria-label="Следующий этап">Далее<ArrowRight size={16}/></button></div><label className="atlas-select-label" htmlFor={`campaign-${campaign.id}`}>Этап {step+1} из {campaign.steps.length}</label><input className="atlas-stage-slider" id={`campaign-${campaign.id}`} aria-valuetext={`${current.date}: ${current.title}`} type="range" min={0} max={campaign.steps.length-1} value={step} onChange={e=>move(Number(e.target.value))}/><div className="atlas-stage" aria-live="polite"><span className="mini-label">{current.date}</span><h3>{current.title}</h3><p>{current.text}</p><p className="atlas-stage-sources">Источники: {current.sourceIds.map(id=>{const source=atlasSources.find(s=>s.id===id);return source&&<a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>;})}</p></div><div className="atlas-stage-list" aria-label="Все этапы кампании">{campaign.steps.map((s,i)=><button key={`${s.placeId}-${i}`} aria-current={i===step?'step':undefined} className={i===step?'active':''} onClick={()=>move(i)}><span>{i+1}</span><div><b>{s.date}</b><small>{s.title}</small></div></button>)}</div><Link className="atlas-lesson-link" to={`/lesson/${campaign.lessonId}`}>Перейти к уроку о событии<ArrowRight size={16}/></Link></div>;
}

export function AtlasCampaignLibrary({eraId}:{eraId:string}){
 const recommended=atlasCampaigns.find(c=>c.eraIds.includes(eraId))??atlasCampaigns[0];
 const [selected,setSelected]=useState(recommended.id);
 const campaign=atlasCampaigns.find(c=>c.id===selected)??recommended;
 return <section className="atlas-campaign-library" aria-labelledby="atlas-campaign-title"><span className="mini-label">ВРЕМЯ И ПРОСТРАНСТВО</span><h2 id="atlas-campaign-title">События по этапам</h2><p className="muted">Последовательность выбранных эпизодов с подсветкой места. Промежутки между точками не превращаются в нарисованную дорогу; районы боёв показаны только географическими ориентирами.</p><label className="atlas-select-label" htmlFor="atlas-campaign-select">Выберите событие</label><select id="atlas-campaign-select" className="atlas-select" value={selected} onChange={e=>setSelected(e.target.value)}>{atlasCampaigns.map(c=><option key={c.id} value={c.id}>{c.eraIds.includes(eraId)?'Для этой эпохи · ':''}{c.title}</option>)}</select><CampaignPlayer key={campaign.id} campaign={campaign}/></section>;
}
