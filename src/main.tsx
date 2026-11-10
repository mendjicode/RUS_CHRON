import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter,Routes,Route,Link,useLocation} from 'react-router-dom';
import {useStore} from './lib/store';
import {Layout} from './components/Layout';
import {Dashboard} from './pages/Dashboard';
import {Course} from './pages/Course';
import {Lesson} from './pages/Lesson';
import {Atlas} from './pages/Atlas';
import {Timeline} from './pages/Timeline';
import {Dictionary,People,Bookmarks,About} from './pages/Reference';
import {Practice} from './pages/Practice';
import {Achievements} from './pages/Achievements';
import {Settings} from './pages/Settings';
import './styles.css';
class ErrorBoundary extends React.Component<{children:React.ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return {error:true};}render(){return this.state.error?<div className="fatal-screen"><h1>Не удалось открыть приложение</h1><p>Сохранённые данные не удалены. Перезагрузите страницу; если ошибка повторяется, сообщите о ней в репозитории.</p><button className="button" onClick={()=>location.reload()}>Перезагрузить</button></div>:this.props.children;}}
function ScrollReset(){const {pathname}=useLocation();useEffect(()=>{if(!pathname.startsWith('/lesson/'))window.scrollTo(0,0);},[pathname]);return null;}
function App(){const [ready,setReady]=useState(false);const theme=useStore(s=>s.theme);useEffect(()=>{useStore.persist.rehydrate()?.then(()=>setReady(true));},[]);useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)');const apply=()=>document.documentElement.dataset.theme=theme==='system'?(media.matches?'dark':'light'):theme;apply();media.addEventListener('change',apply);return()=>media.removeEventListener('change',apply);},[theme]);if(!ready)return <div className="loading-screen"><div className="loading-mark">ХР</div><p>Открываем вашу историю…</p></div>;return <HashRouter><ScrollReset/><Routes><Route element={<Layout/>}><Route index element={<Dashboard/>}/><Route path="course" element={<Course/>}/><Route path="lesson/:id" element={<Lesson/>}/><Route path="atlas" element={<Atlas/>}/><Route path="timeline" element={<Timeline/>}/><Route path="people" element={<People/>}/><Route path="dictionary" element={<Dictionary/>}/><Route path="practice" element={<Practice/>}/><Route path="achievements" element={<Achievements/>}/><Route path="settings" element={<Settings/>}/><Route path="bookmarks" element={<Bookmarks/>}/><Route path="about" element={<About/>}/><Route path="*" element={<div className="empty"><h1>Страница не найдена</h1><Link to="/">Вернуться на главную</Link></div>}/></Route></Routes></HashRouter>;}
if(import.meta.env.PROD&&['http:','https:'].includes(location.protocol)&&'serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>window.dispatchEvent(new Event('ruschron-offline-error')));});}
createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><App/></ErrorBoundary></React.StrictMode>);
