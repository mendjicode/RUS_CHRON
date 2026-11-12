import sys
sys.path.insert(0,'/workspace/RUS_CHRON/tasks/001-russian-history-course')
from course_author import add,q

def lesson(id,description,goals,simple,body,deep,summary,dates,questions,people=[],terms=[],points=[],extra=[]):
    source=['muscovy','cambridge1'] if id.startswith('05') else ['imperial','cambridge2']
    add(id,description,goals,simple,body,deep,summary,dates,people,terms,points,source+extra,questions)
