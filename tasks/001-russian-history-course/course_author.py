"""Lossless helper for new, individually authored lessons; never overwrite existing materials."""
import json,pathlib
ROOT=pathlib.Path('/workspace/RUS_CHRON')
PLAN=json.loads((ROOT/'src/content/curriculum.json').read_text())
def q(kind,prompt,options,answer,explanation,**extra):
    return dict(type=kind,prompt=prompt,options=options if options is not None else [],answer=answer,explanation=explanation,**extra)
def add(id,description,goals,simple,body,deep,summary,dates,people,terms,points,sources,questions,review_note=None):
    target=ROOT/f'src/content/lessons/{id}.json'
    if target.exists():
        raise FileExistsError(f'Существующий материал сохраняется: {target}')
    entry=next(x for x in PLAN if x['id']==id)
    sections=[]
    for block in body.strip().split('\n## '):
        title,text=block.strip().split('\n',1)
        sections.append({'title':title.removeprefix('## '),'paragraphs':[p.strip() for p in text.split('\n\n') if p.strip()]})
    lesson={key:entry[key] for key in ['id','title','eraId','module','order']}
    lesson.update(description=description,goals=goals,simple=simple,sections=sections,deep={'title':deep[0],'text':deep[1],'question':deep[2]},summary=summary,dates=[dict(year=d[0],label=d[1],detail=d[2],category=d[3]) for d in dates],people=people,terms=terms,mapPoints=points,sources=sources,questions=[dict(id=f'{id}-q{i+1}',**item) for i,item in enumerate(questions)],status='written',reviewNote=review_note or 'Авторский учебный материал со ссылками на источники. Подтверждённые опорные факты и ограничения отражены в журнале подготовки; полная научная редактура не завершена.',updatedAt='2026-11-10',media=[])
    words=len(' '.join(p for s in sections for p in s['paragraphs']).split())
    if words<500:print(f'ВНИМАНИЕ {id}: основной текст {words} слов, требуется развитие темы.')
    if len(sections)<5 or len(questions)<4:raise ValueError(f'{id}: нужны минимум пять смысловых разделов и четыре уникальных задания')
    if len(summary)<3:raise ValueError(f'{id}: нужны как минимум три предметных пункта резюме')
    if len(goals)<2 or len(description)<40 or len(simple)<200 or len(deep[1])<200 or len(dates)<2:raise ValueError(f'{id}: неполные цели/объяснение/даты')
    for question in lesson['questions']:
        if not isinstance(question.get('options',[]),list):raise ValueError(f"{id}: варианты должны быть массивом")
        if len(question['prompt'])<12 or len(question['explanation'])<25 or not question['answer']:raise ValueError(f"{id}: вопрос или разбор недостаточен")
    target.write_text(json.dumps(lesson,ensure_ascii=False,indent=2)+'\n')
    print(id,words,'слов',len(questions),'заданий')
