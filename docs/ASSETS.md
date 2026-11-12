# Ресурсы и атрибуции

Все используемые продуктом изображения, шрифты и географические данные сохранены локально. Внешние URL ниже служат атрибуцией и не запрашиваются при чтении уроков.

| Файл | Происхождение | Условия / контекст |
| --- | --- | --- |
| `public/assets/kremlin.jpg` | [Wikimedia Commons: Vasnetsov Kreml pri Ivane kalite](https://commons.wikimedia.org/wiki/File:Vasnetsov_Kreml_pri_Ivane_kalite.jpg) | Аполлинарий Васнецов, 1921. Public domain / faithful reproduction. Художественная реконструкция, не изображение очевидца XIV века. |
| `public/assets/land.geojson` | [Natural Earth, ne_110m_land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson) | [Public domain](https://www.naturalearthdata.com/about/terms-of-use/). Современная физическая основа, без исторических границ. |
| `public/assets/golos.ttf` | [Google Fonts / Golos Text](https://github.com/google/fonts/tree/main/ofl/golostext) | SIL Open Font License; текст лицензии `GOLOS-LICENSE.txt`. |
| `public/assets/literata.ttf` | [Google Fonts / Literata](https://github.com/google/fonts/tree/main/ofl/literata) | SIL Open Font License; текст лицензии `LITERATA-LICENSE.txt`. |
| `public/icon.svg` | Авторский векторный знак для приложения | Декоративный символ книги; не исторический артефакт. |

Lucide предоставляет интерфейсные иконки, лицензия ISC. Лицензии программных зависимостей доступны в соответствующих пакетах и lock-файле. Собственные тексты не содержат длинных копий энциклопедических статей. Библиографические ссылки не означают копирования текста книги.

## Дополнение при продолжении курса

`src/content/additional-places.json` содержит выбранные современные координаты из [Natural Earth1:50m populated places](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_populated_places.geojson), public domain. Исходный набор сохранён в папке текущей задачи для воспроизводимости. Это координаты городских ориентиров, не исторические границы, не точные позиции войск и не реконструкция средневековой площади города. Добавлены Казань, Астрахань, Тверь, балтийские и европейские центры, города Урала и Сибири. Подписи оговаривают пределы использования.


## Портреты: дополнение 12 ноября 2026

Локальные оригинальные репродукции без обработки в `public/assets/portraits/`. Метаданные, ссылки на карточки и ограничения атрибуции — `src/content/portraits.json`. Проверены карточки Commons и изображение: Пётр I (Годфри Кнеллер,1698; Royal Collection RCIN405645), Екатерина II (Фёдор Рокотов,1763; Третьяковская галерея), Михаил Кутузов (неизвестный художник,XIXвек; точные дата и местонахождение не установлены). Для последнего не утверждается прижизненность; ошибочная атрибуция Джорджу Доу не используется. Для всех трёх карточки Commons указывают public domain / PD-Art.

## Исторические карты: дополнение 12 ноября 2026

Все семь листов сохранены локально без изменения исходных байтов в `public/assets/atlas/`. Происхождение, прямой URL загрузки, дата получения, размеры, SHA-256, легенда и пределы использования: `public/assets/atlas/provenance.json`; исследовательская запись: `tasks/001-russian-history-course/research-atlas.md`. Ссылки в таблице открываются только по действию пользователя. Копии изображений входят в сборку для чтения без сети.

| Локальный файл в `public/assets/atlas/` | Автор, издание, источник скана | Условия и контекст |
| --- | --- | --- |
| `europe-c1000-shepherd-1911.jpg` | William R. Shepherd, Historical Atlas, 1911, с. 58–59. [University of Texas Libraries](https://maps.lib.utexas.edu/maps/historical/shepherd_1911/shepherd-c-058-059.jpg) | Public domain; автор умер в 1934. Поздняя реконструкция Европы около 1000; границы условны, Russia означает средневековую Русь. |
| `russia-growth-1300-1796-shepherd-1926.jpg` | William R. Shepherd, Historical Atlas, 1926, с. 138–139. [University of Texas Libraries](https://maps.lib.utexas.edu/maps/historical/shepherd/russian_growth_1300_1796.jpg) | Public domain; автор умер в 1934. Составная схема приращений 1300–1796 и разделов Речи Посполитой; не снимок одного года. |
| `russian-empire-rees-1820.jpg` | The Cyclopaedia, редактор Abraham Rees (1743–1825), 1820 по каталогу. [University of Texas Libraries](https://maps.lib.utexas.edu/maps/historical/russian_empire_1820.jpg) | Public domain. Документ картографического знания начала XIX века; актуальность каждой линии на 1820 год не установлена. |
| `minard-russian-campaign-1869.png` | Charles Joseph Minard (1781–1870), Париж, 20.11.1869. [Wikimedia Commons: Minard.png](https://commons.wikimedia.org/wiki/File:Minard.png) | Public domain, автор умер более 100 лет назад. Статистическая реконструкция кампании 1812: обобщённые направления и авторские оценки численности; температура в °Ré. |
| `ussr-administrative-1989-cia.jpg` | CIA, Soviet Union: Administrative Divisions, 1989, 800656 (545499), 10-89. [University of Texas Libraries](https://maps.lib.utexas.edu/maps/commonwealth/soviet_union_admin_1989.jpg) | Public domain, работа федерального ведомства США; [правила CIA](https://www.cia.gov/site-policies/#copyright-notice). Сохранены оговорка составителя о непризнании включения Балтийских республик и предупреждение о прочих границах. Это административная карта 1989, не карта фронтов 1942. |
| `medieval-commerce-shepherd-1926.jpg` | William R. Shepherd, Historical Atlas, 1926, с. 98–99. [University of Texas Libraries](https://maps.lib.utexas.edu/maps/historical/shepherd/europe_mediaeval_commerce.jpg) | Public domain. Обобщение торговли Средневековья, оригинальные сухопутные/морские маршруты и торговые связи Ганзы. Не точная трасса «пути из варяг в греки» IX–X веков. |
| `baltic-1701-freeman-bury-1903.jpg` | Atlas to Freeman’s Historical Geography, редактор J. B. Bury, 3-е издание, Longmans, Green & Co., 1903. [University of Texas Libraries](https://maps.lib.utexas.edu/maps/historical/baltics_1701.jpg) | Public domain: Freeman умер в 1892, Bury в 1927; издание 1903. Реконструкция политической географии около 1701: пространство Северной войны, без выдуманных линий движения армий. |

[Правила Perry–Castañeda Map Collection](https://maps.lib.utexas.edu/maps/faq.html#3.html) разрешают копирование сканов, находящихся в public domain, и рекомендуют указание University of Texas Libraries. У выбранных старых листов проверены каталог и само изображение. Исторические издательские знаки сохранены; они не выдаются за действующее исключительное право. Разрешение библиотеки не переносится автоматически на другие сайты или современные карты. Построчная научная и отдельная юридическая экспертиза для всех юрисдикций не заявляются.


### Архивная фотография Ялтинской конференции

`public/assets/yalta-1945.jpg` — оригинальная чёрно-белая репродукция без обработки. Служебная фотография правительства США, NARA111-SC-260486/NAID531340; общественное достояние (PD-USGov). КарточкаCommons: https://commons.wikimedia.org/wiki/File:Yalta_Conference_(Churchill,_Roosevelt,_Stalin)_(B%26W).jpg . Архив: https://catalog.archives.gov/id/531340 . Изображение и метаданные просмотрены12.11.2026. Использована осторожная архивная датировка «февраль1945»: исходная подпись говорит, что точный день не установлен, хотя поле карточки Commons содержит9февраля. Методическое пояснение отделяет постановочную официальную сцену от содержания договорённостей.


### Значок Windows

`build/icon.png` и `build/icon.ico` получены13.11.2026 визуализацией существующего авторского `public/icon.svg` черезChromium по локальномуHTTP, затем стандартным преобразованиемPNG→ICO(Pillow, размеры16–256px). Рисунок не подменён сторонней иллюстрацией. Воспроизводимый источник: `tasks/001-russian-history-course/render-icon.cjs`; итоговые файлы включаются в Git, поэтому сборкаWindows не требуетPython/Chromium для генерациизначка.
