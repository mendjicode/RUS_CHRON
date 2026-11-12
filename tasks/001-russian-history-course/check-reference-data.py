"""Check separately authored reference data without changing shared manifests."""
import collections,json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2]
c=root/'src/content'
load=lambda p:json.loads(p.read_text())
lessons={r['id'] for r in load(c/'curriculum.json')}
eras={r['id'] for r in load(c/'eras.json')}
sources=set(re.findall(r"id:'([^']+)'",(c/'sources.ts').read_text()))
packids=[]
source_fields={'id','title','author','kind','url','note'}
kinds={'Первичный источник','Исследование','Энциклопедия','Учебное издание','Данные'}
for p in (c/'source-packs').glob('*.json'):
 for r in load(p):
  assert source_fields <= set(r),(p,r.get('id'),'source fields')
  assert r['kind'] in kinds,(p,r['id'],'source kind')
  assert re.match(r'^https?://',r['url']),(p,r['id'],'URL')
  sources.add(r['id']);packids.append(r['id'])
assert not [i for i,n in collections.Counter(packids).items() if n>1],'Duplicate source-pack IDs'
for stem,orig,required,minimum in [
 ('additional-people','people',{'id','name','years','role','eraId','bio','actions','debate','sources'},25),
 ('additional-terms','terms',{'id','title','definition','example'},35),
 ('world-context',None,{'id','year','eraId','russia','world','connection','sources','lessonIds'},10),
]:
 rows=load(c/f'{stem}.json');ids=[r['id'] for r in rows]
 assert len(rows)>=minimum,(stem,'minimum')
 assert len(ids)==len(set(ids)),(stem,'duplicate IDs')
 if orig:assert not set(ids)&{r['id'] for r in load(c/f'{orig}.json')},(stem,'existing IDs')
 for r in rows:
  assert all(k in r and r[k] for k in required),(stem,r['id'],'required fields')
  assert all(s in sources for s in r.get('sources',[])),(stem,r['id'],'source IDs')
  assert r.get('lessonIds') and all(i in lessons for i in r['lessonIds']),(stem,r['id'],'lesson IDs')
  if 'eraId' in r:assert r['eraId'] in eras,(stem,r['id'],'era ID')
  if stem=='additional-people':
   assert all(len(r[k])>=170 for k in ['bio','actions','debate']),(stem,r['id'],'substantive text')
  if stem=='additional-terms':
   assert len(r['definition'])>=150 and len(r['example'])>=70,(stem,r['id'],'definition/example')
  if stem=='world-context':
   assert isinstance(r['year'],int) and 0<r['year']<=2026,(stem,r['id'],'year')
   assert all(isinstance(r[k],dict) and r[k].get('title') and len(r[k].get('description',''))>=100 for k in ['russia','world']),(stem,r['id'],'paired event')
 print(f'{stem}: {len(rows)}; unique IDs, fields, sources, era and lesson links OK')
print('Reference source pack:',len(load(c/'source-packs/references.json')),'valid records')
