"""Conservative typography; original21lesson passages are protected byte for byte."""
import json,re,subprocess
from pathlib import Path
paths=subprocess.check_output(['git','ls-tree','-r','--name-only','830016c','src/content/lessons'],text=True).splitlines()
old={Path(p).stem:json.loads(subprocess.check_output(['git','show','830016c:'+p],text=True)) for p in paths}
fix={'оработе':'о работе','вконкретном':'в конкретном','одате':'о дате','озаказе':'о заказе','кполитическому':'к политическому','впрактике':'в практике','ксистеме':'к системе','висходном':'в исходном','Висходном':'В исходном','наопределённую':'на определённую','напервый':'на первый','навторой':'на второй','натретий':'на третий','кформуле':'к формуле','вопределённое':'в определённое','кюлианскому':'к юлианскому','безоговорки':'без оговорки','надоступные':'на доступные','напроизвольный':'на произвольный','сконкретным':'с конкретным','вкаждом':'в каждом','вразных':'в разных','вэтом':'в этом','втексте':'в тексте','всистеме':'в системе','всоставе':'в составе','сдокументами':'с документами'}
keys={'title','description','goals','simple','paragraphs','text','question','summary','label','detail','prompt','options','answer','explanation','reviewNote'}
changes=0

def text(s):
 global changes
 before=s
 s=re.sub(r'(?<=[А-Яа-яЁё])(?=\d)',' ',s)
 s=re.sub(r'(?<=\d)(?=[А-Яа-яЁё])',' ',s)
 s=re.sub(r'(?<=[А-Яа-яЁё])(?=[IVX]{1,5}(?:[^A-Za-z]|$))',' ',s)
 s=re.sub(r'(?<=[IVXLCDM])(?=[А-Яа-яЁё])',' ',s)
 s=re.sub(r'\b(в|к|с|о|у|на|по|об|из|за|от|до|при)(?=[А-ЯЁ])',r'\1 ',s)
 for a,b in fix.items():s=re.sub(r'\b'+a+r'\b',b,s)
 if s!=before:changes+=1
 return s

def walk(v,baseline=None,key=''):
 if v==baseline:return v
 if isinstance(v,str):
  if key not in keys:return v
  if isinstance(baseline,str) and key=='text' and v.startswith(baseline):return baseline+text(v[len(baseline):])
  return text(v)
 if isinstance(v,list):
  return [walk(x,baseline[i] if isinstance(baseline,list) and i<len(baseline) else None,key) for i,x in enumerate(v)]
 if isinstance(v,dict):return {k:walk(x,baseline.get(k) if isinstance(baseline,dict) else None,k) for k,x in v.items()}
 return v
for p in sorted(Path('src/content/lessons').glob('*.json')):
 d=json.loads(p.read_text());d=walk(d,old.get(d['id']));d['updatedAt']='2026-11-13';p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=Path('src/content/curriculum.json');d=json.loads(p.read_text())
for entry in d:entry['title']=text(entry['title'])
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
Path('tasks/001-russian-history-course/copyedit-final-result.json').write_text(json.dumps({'changedTextFields':changes,'originalLessonsProtected':len(old),'date':'2026-11-13'},ensure_ascii=False,indent=2)+'\n')
print('Typography:',changes,'fields; protected originals:',len(old))
