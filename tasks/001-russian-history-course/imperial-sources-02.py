import json,pathlib
p=pathlib.Path('/workspace/RUS_CHRON/src/content/source-packs/imperial-revolutions.json');a=json.loads(p.read_text())
for id,title,author,kind,url,note in [
('ir-narodnik','Narodniki','The Columbia Encyclopedia, Encyclopedia.com','Энциклопедия','https://www.encyclopedia.com/reference/encyclopedias-almanacs-transcripts-and-maps/narodniki','Проверены опорные даты1874,1879,1881. Общие оценки отклика крестьян требуют местной проверки; движение не сводится к террору.'),
('ir-industry','Основные этапы формирования кадров промышленного пролетариата в России','Национальный атлас России,том4','Учебное издание','https://nationalatlas.ru/tom4/140.html','Проверены признаки машинного производства и условные хронологические рамки. Не используется как единая статистика каждого предприятия.'),
('ir-alexander3','Законодательные акты АлександраIII','Президентская библиотека','Первичный источник','https://www.prlib.ru/section/681962','Коллекция актов; проверены библиографические опоры. Наличие акта в коллекции не доказывает одинаковую практику исполнения.'),
('ir-counter','Положение о земских участковых начальниках,12июля1889','Российская империя;Президентская библиотека','Первичный источник','https://www.prlib.ru/item/1620610','Проверена карточка издания и дата. Полный экземпляр требует доступа через электронный читальный зал.'),
('ir-witte','Сергей Юльевич Витте','Библиотека Банка России','Исследование','https://library.cbr.ru/media/virtual_exhibitions/sergey_vitte/','Проверены хронология денежной реформы1897 и поэтапность введения винной монополии. Не утверждается одномоментное введение по всей империи.')]:
 if not any(s['id']==id for s in a):a.append(dict(id=id,title=title,author=author,kind=kind,url=url,note=note,checkedAt='2026-11-10'))
p.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n')
