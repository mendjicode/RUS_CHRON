from course_author import add
def lesson(id,desc,simple,body,deep,dates,sources,quiz):
    add(id,desc,['Объяснить основные события и их связь с условиями эпохи.','Сопоставить решения участников с последствиями и показаниями источников.'],simple,body,deep,[x[1] for x in dates],dates,[],[],[],sources,quiz)

# Дополнительная проверка до записи следующих партий; существующие данные не меняет.
_original_lesson = lesson
def lesson(id,desc,simple,body,deep,dates,sources,quiz):
    summaries=[x[1] for x in dates]
    if len(summaries)<3:summaries.append(simple.split('. ')[0].rstrip('.')+'.')
    assert len(simple)>=200 and len(deep[1])>=200 and len(quiz)>=4 and len(dates)>=2 and len(sources)>=2
    assert all(len(x['prompt'])>=12 and len(x['explanation'])>=25 and x['answer'] for x in quiz)
    add(id,desc,['Объяснить основные события и их связь с условиями эпохи.','Сопоставить решения участников с последствиями и показаниями источников.'],simple,body,deep,summaries,dates,[],[],[],sources,quiz)
