import {readFile,readdir,writeFile} from 'node:fs/promises';
import {lessonSchema} from '../../src/content/schema';
import {courseModules} from '../../src/content/modules';
import {atlasSheets,atlasCampaigns} from '../../src/content/atlas';
import {sources} from '../../src/content/sources';
const json=async(p:string)=>JSON.parse(await readFile(p,'utf8'));
const date='13 ноября 2026';
const plan=await json('src/content/curriculum.json') as {id:string;title:string;eraId:string}[];
const lessons=await Promise.all((await readdir('src/content/lessons')).filter(p=>p.endsWith('.json')).sort().map(async p=>lessonSchema.parse(await json(`src/content/lessons/${p}`))));
const eras=await json('src/content/eras.json') as {id:string;title:string;period:string}[];
const terms=[...await json('src/content/terms.json'),...await json('src/content/additional-terms.json')];
const people=[...await json('src/content/people.json'),...await json('src/content/additional-people.json')];
const questions=lessons.flatMap(l=>l.questions);const events=lessons.flatMap(l=>l.dates);
const words=lessons.reduce((n,l)=>n+l.sections.flatMap(s=>s.paragraphs).join(' ').split(/\s+/).length,0);
const byId=new Map(lessons.map(l=>[l.id,l]));
const checks=await json('tasks/001-russian-history-course/final-checks.json').catch(()=>null) as null|{unitTests:number;browserTests:number;precache:number;windows?:string;installerUrl?:string;qualityRun?:string;windowsRun?:string};
const state=`Уроки: ${lessons.length}/${plan.length}; задания: ${questions.length}; понятия: ${terms.length}; биографии: ${people.length}; хронологические записи: ${events.length}. Объём основного текста (слов): ${words.toLocaleString('ru')}, без простого/углублённого режимов и упражнений.`;
const latestInformationAsOf=lessons.map(l=>l.informationAsOf).filter((d):d is string=>!!d).sort().at(-1)??'2026-02-16';
const audit=`Все материалы имеют статус «написан»: выборочная сверка источников и технические проверки выполнены, полная построчная научная и методическая редактура не завершена. Наличие ссылки не выдаётся за подтверждение каждой фразы. Основной современный разбор опирается на февральские документы 2026 года; последнее отдельно датированное дополнение — ${latestInformationAsOf}. Дата обновления приложения не расширяет охват каждого источника.`;
const validation=checks?`Проверки финального состояния: ${checks.unitTests} автоматических тестов; TypeScript и production build; локальных ресурсов в офлайн-кэше: ${checks.precache}; ${checks.browserTests} сценариев Chromium, включая открытие каждого урока, перезагрузку данных и работу без сети. ${checks.windows??'Windows: новый workflow включает сборку, тихую установку NSIS и запуск установленного приложения; результат конкретного запуска указан в отчёте GitHub Actions.'}`:'Результаты выполненных проверок записываются в docs/QA.md и папке задачи. Проверки после последних изменений ещё не объявлены пройденными.';
function tidyProse(body:string):string{
 const terms='Windows|Electron|Node\\.js|IndexedDB|JSON|React|TypeScript|Vite|Tailwind|Motion|Lucide|Router|Zustand|Recharts|PWA|NSIS|GitHub|Chromium|Firefox|Python|CSS|HTML|CI|Ctrl|Esc|SSR|DPPA|OHCHR|CRS|IMF|NARA';
 const protectedParts=/(```[\s\S]*?```|`[^`\n]+`|https?:\/\/[^\s)>]+)/g;
 return body.replace(/(?<=[А-Яа-яЁё])(?=`)/g,' ').replace(/`(?=[А-Яа-яЁё])/g,'` ').split(protectedParts).map(p=>p.startsWith('`')||p.startsWith('http')?p:p.replace(/(?<=[А-Яа-яЁё])(?=\d)/g,' ').replace(/(?<=\d)(?=[А-Яа-яЁё])/g,' ').replace(/(?<=[А-Яа-яЁё])([,;])(?=\d)/g,'$1 ').replace(new RegExp('(?<=[А-Яа-яЁё])(?=(?:'+terms+')\\b)','g'),' ').replace(new RegExp('('+terms+')(?=[А-Яа-яЁё])','g'),'$1 ')).join('');
}
async function snapshot(path:string,body:string){const content=tidyProse(body.trim())+'\n';const previous=await readFile(path,'utf8').catch(()=> '');if(previous.startsWith(content))return;await writeFile(path,content+(previous?'\n\n---\n\n<details>\n<summary>Предыдущая редакция — сохранена для истории, её числа и TODO относятся к прежней версии</summary>\n\n'+previous+'\n</details>\n':''));}
await snapshot('README.md',`# Хроники России

Локальное приложение для изучения истории России от древности до современности. Без аккаунта и собственного сервера. Существующие дизайн, архитектура и идентификаторы сохранений сохранены.

**Состояние на ${date}:** ${state}

${audit}

## Запуск

Требуется Node.js 22.12+ и npm. В существующей папке проекта:

\`\`\`sh
npm install
npm run dev
\`\`\`

Откройте адрес Vite, обычно http://localhost:5173. Для производственной версии: \`npm run build\`, затем \`npm run preview\`. В браузере дождитесь «Автономный режим готов»; после этого уроки и локальные ресурсы доступны без сети. Внешняя литература открывается по сети.

## Курс и обучение

- Все темы (${plan.length}) имеют собственные тексты, три содержательных уровня, цели, даты, резюме, источники и задания;${courseModules.length} смысловых модулей объединяют темы.
- Девять видов заданий: выбор, несколько ответов, хронология, соответствия, причины, пропуск, география, документ, свободный ответ. Свободные ответы и открытые причинные вопросы сохраняются как самооценка. Итог эпохи собирает до 20 вопросов из разных уроков.
- Интервальное повторение, история ответов, время, достижения и прогресс по реальным действиям. Можно открывать уроки в любом порядке.
- Заметки, закладки уроков, избранные события, факт дня, поиск;${terms.length} терминов,${people.length} персоналий,15 сопоставлений Россия–мир.
- Отдельные позиции чтения для трёх уровней, размер текста, режим чтения, светлая/тёмная/системная темы. Ctrl/⌘+K открывает поиск, Esc закрывает карточки.
- Семь подлинных локальных карт с границами/направлениями, зумом и перемещением;3 пошаговых сценария с${atlasCampaigns.reduce((n,c)=>n+c.steps.length,0)} этапами. Происхождение и ограничения каждого листа видны в атласе.
- Учебные сравнения, схема событий1991года, фрагменты родословных; три исторических портрета и архивная фотография с атрибуцией.

Прогресс хранится на устройстве в IndexedDB. В настройках можно экспортировать/импортировать JSON-копию; копии v1 предыдущей версии поддерживаются. Браузер и Windows-приложение имеют отдельные хранилища.

## Windows

\`\`\`sh
npm run desktop
npm run dist:win
\`\`\`

Собирать установщик следует на Windows. Готовый файл сохраняется в\`release/\`. В GitHub Actions workflow **Windows installer** создаёт артефакт\`rus-chron-windows\` после успешного **Quality checks**. Проверяется тихая установка и запуск установленного приложения с записью/перезагрузкой заметки в отдельном профиле. [Сборки GitHub Actions](https://github.com/mendjicode/RUS_CHRON/actions) · [инструкция](docs/WINDOWS.md).

${checks?.installerUrl?`[Скачать проверенный установщик Windows (ZIP с .exe)](${checks.installerUrl})`:''}

## Проверки

\`\`\`sh
npm run check
npm run verify:dist
npx playwright install chromium
npm run test:browser
npm run docs:content
\`\`\`

${validation}

Для облачной веб-разработки без запуска Electron доступен\`ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci\`; обычная Windows-установка использует стандартный\`npm install\`.

## Документация

[Программа](CURRICULUM.md) · [состояние](CONTENT_STATUS.md) · [источники](SOURCES.md) · [архитектура](ARCHITECTURE.md) · [проверки](docs/QA.md) · [оставшаяся редактура](TODO.md) · [исходноеТЗ](docs/BRIEF.md) · [происхождение изображений](docs/ASSETS.md) · [история задачи](tasks/001-russian-history-course/TASK.md).
`);
await snapshot('CURRICULUM.md',`# Полная программа —${date}

${state}

Модули имеют собственные задачи. Ниже ожидаемые знания, даты, визуальные материалы и упражнения выведены из реально написанных уроков. Старые технические номера в JSON сохранены ради совместимости; смысловая группировка задаётся в\`src/content/modules.ts\`.

${eras.map(era=>`## ${era.title} · ${era.period}\n\n`+courseModules.filter(m=>m.eraId===era.id).map(m=>`### ${m.title}\n\n${m.goal}\n\n`+m.lessonIds.map(id=>{const l=byId.get(id);if(!l)return `- ${id}: текст ещё не написан.`;const sheets=atlasSheets.filter(s=>s.lessonIds.includes(id)).map(s=>s.title);return `**${id}. ${l.title}**\n\n- Цели: ${l.goals.join(' ')}\n- Ожидаемые знания: ${l.summary.slice(0,2).join(' ')}\n- Опорные события: ${l.dates.map(d=>`${d.year} — ${d.label}`).join('; ')}.\n- Визуальные материалы: хронология${l.mapPoints.length?`, географические ориентиры(${l.mapPoints.join(', ')})`:''}${sheets.length?`; листы: ${sheets.join('; ')}`:''}.\n- Упражнения: ${[...new Set(l.questions.map(q=>q.type))].join(', ')}; всего ${l.questions.length}, каждое с объяснением.\n`;}).join('\n')).join('\n')).join('\n')}
`);
await snapshot('SOURCES.md',`# Источники и проверка —${date}

Источников в реестре: ${sources.length}. Исходные источники сохранены в\`src/content/sources.ts\`, дополнительные — в\`src/content/source-packs/\`; генератор проверяет уникальность и не допускает потери старыхID. Кнопки источников доступны в каждом уроке, справочнике и разделе атласа.

${audit}

## Как выполнялась работа

Авторские учебные тексты написаны отдельно от цитируемой литературы. Открывались первичные документы, научные/университетские обзоры, музейные и архивные карточки. Журналы в\`tasks/001-russian-history-course/research-*.md\` различают чтение текста, просмотр карточки, недоступный полный том и ограничения старых обзоров. Непроверенные точные потери, легендарные детали и обнаруженные аномальные цифры не переносились в новые тексты.

Старые обзоры БиблиотекиКонгресса не используются как единственный источник современных оценок репрессий и военных потерь. Нормативный акт подтверждает норму, а не её исполнение; официальная позиция стороны конфликта отличается от установленного международным документом факта. Перевод/комментарий составителя в упражнениях не выдаётся за цитату.

Карты не рисовались случайной геометрией: локальные сканы реальных изданий сопровождаются происхождением, лицензией и ограничениями. Репродукции сохраняют оригинальные подписи. Список активов и атрибуции — [docs/ASSETS.md](docs/ASSETS.md), SHA-256 карт —\`public/assets/atlas/provenance.json\`.

## Реестр

| ID | Источник | Вид | Пределы проверки |
| --- | --- | --- | --- |
${sources.map(s=>`| ${s.id} | [${s.title.replaceAll('|','/')} ](${s.url}) · ${s.author.replaceAll('|','/')} | ${s.kind} | ${s.note.replaceAll('|','/')} |`).join('\n')}
`);
await snapshot('ARCHITECTURE.md',`# Архитектура —${date}

Сохранён стек React19/TypeScript/Vite/Tailwind/Motion/Lucide/Router/Zustand/IndexedDB/Recharts/D3. Основные разделы приложения и стили расширены без замены существующего дизайна. Electron запускает ту же локальную сборку черезfile://; в браузере используетсяHashRouter иPWA.

| Область | Файлы и назначение |
| --- | --- |
| Учебный корпус | \`src/content/lessons/*.json\`, Zod в\`schema.ts\`; ${lessons.length} уроков |
| Программа | \`curriculum.json\` — стабильныеID/порядок; \`modules.ts\` —${courseModules.length} смысловых модулей |
| Источники | \`sources.ts\`, \`source-packs/*.json\`, проверяемый \`source-packs.generated.json\` |
| Справочники | исходные \`terms.json/people.json\` + добавочные JSON; связи с уроками объединяются в\`index.ts\` |
| Атлас | \`atlas.ts\`, \`geography.ts\`, \`HistoricalMap.tsx\`, \`AtlasDocuments.tsx\`; локальные7сканов/43точки |
| Наглядные объяснения | \`visual-guides.ts\`, \`LearningVisuals.tsx\`, \`WorldContext.tsx\`, \`Portrait.tsx\`, \`LessonIllustrations.tsx\` |
| Обучение | \`learning.ts\` — интервалы и проверка; \`exams.ts\` — распределение вопросов по урокам |
| Хранение | \`store.ts\`: IndexedDB, копияv1 с добавочными\`favoriteEvents/readingDetails\`; старые копии получают значения по умолчанию |
| Сборка |10 пакетов уроков по эпохам; все включаются в PWA precache, локальные ресурсы проверяет\`verify-dist.ts\` |
| Windows | \`electron/main.cjs\`, изолированныйrenderer; \`smoke.cjs\` по явному флагу тестирует установленную сборку в новом временном профиле |
| Проверки | Vitest, \`browser-tests/*.e2e.ts\`, CI Quality checks и Windowsinstaller |

В\`predev/prebuild\` сначала строится реестр источников и выполняется проверка схем/связей. Некорректный урок не попадёт в выпуск. Генерация источников сохраняет прежниеID. Экспорт и импорт проверяют неизвестные уроки/вопросы/события до замены пользовательских данных.

При добавлении урока соблюдайте [AGENTS.md](AGENTS.md), обновляйте программу и реальный статус. Запрещено автоматически повышатьwritten доchecked/ready из-за прохождения сборки.
`);
await snapshot('TODO.md',`# Оставшиеся работы после полного наполнения —${date}

${state}

## Выполнено в этом продолжении

- [x] Написаны все темы программы, расширены короткие углублённые объяснения и ключевые исходные уроки.
- [x] Смысловые модули, цели и ожидаемые знания; три уровня и разнообразные задания, включая пропуски и итог эпохи.
- [x] Справочники, мировой контекст, избранные события, факт дня, связанные личности в уроках.
- [x] Подлинные исторические карты, торговля, направления кампании1812, пошаговые сценарии, интерактивные схемы и родословные.
- [x] Портреты и архивная фотография с атрибуцией; локальные активы доступны без сети.
- [x] Совместимые резервные копии, раздельное место чтения по режимам; устранён цикл при отказе хранилища.
- [x] Реальные браузерные проверки и расширенные проверки всех данных/локальных ресурсов.
- [x] Подготовлены сборка/тихая установка/запуск Windows вCI, собственный значок установщика.

## Что ещё не объявляется завершённым

- [ ] Полная построчная научная и методическая редактура всего учебника; документированное повышение статусовchecked/ready. Выборочное сопоставление источников уже выполнено, но не заменяет эту работу.
- [ ] Дальнейшее обновление современной истории после${latestInformationAsOf} по новым надёжным документам; текущий срез явно датирован.
- [ ] Исчерпывающие ежегодные векторные границы, точные дороги и позиции всех армий. В текущей версии работают реальные сканы и проверенные последовательности мест; вымышленные данные не добавлялись.
- [ ] Проверка экранным диктором и независимая пользовательская оценка на разных устройствах; коммерческая цифровая подписьWindows. Это не препятствует локальному запуску написанного курса.

${validation}
`);
await snapshot('CONTINUATION.md',`# Продолжение после ${date}

Работа продолжается в\`tasks/001-russian-history-course/\` и существующей рабочей копии. Пользователь разрешил помощников. Ничего не удалять без его явного разрешения; прежние версии документов сохранены ниже.

${state}

Не начинать снова с01-002: эти материалы уже написаны. Сначала прочитать\`TASK.md\`,\`CONTENT_STATUS.md\`,\`docs/QA.md\` и проверить GitHubActions конкретного коммита. Не смешивать написанный курс с завершённой независимой научной редактурой.

Следующая содержательная работа — документированная проверка утверждений, методики и своевременное обновление последних событий; подробнееTODO.md. Идентификаторы уроков/вопросов и формат копииv1 сохранять. Новые данные добавляются через JSON и проверяемые пакеты источников.

${validation}
`);
await snapshot('docs/QA.md',`# Проверки —${date}

${state}

${validation}

${checks?.qualityRun?`[Успешные проверки кода и Chromium](${checks.qualityRun}) · [Успешная установка и запуск Windows](${checks.windowsRun})`:''}

## Что проверяется

- Zod-схемы всех уроков/справочников; принадлежность программе, уникальностьID, связи с источниками/персонами/терминами/местами, допустимость ответов.
- Структурный SSR каждого урока и каждой страницы; реальные взаимодействия, расписание повторения, импорт старыхкопий, отказIndexedDB.
- Chromium: открытие всех уроков через каталог; биография/портрет; мировойконтекст; заметка, закладка и завершение после перезагрузки; офлайн-урок/словарь/атлас;390 px, тёмная тема, поиск;1440 px и итог эпохи.
- Дополнительный сценарий атласа: все7 локальных листов безсети, зум/панорамирование/клавиатура,12 этапов, мобильнаяширина. Результаты: [журнал атласа](../tasks/001-russian-history-course/research-atlas.md),\`atlas-browser-result.json\`.
- Windows workflow: NSIS, тихая установка в новый каталог, запуск установленного приложения, чтение урока и восстановление заметки после перезагрузки. Используется отдельный профиль; учебные данные пользователя не затрагиваются.

Отдельные результаты не заменяют друг друга: статический списокprecache не является браузерным тестом, а технический тест не является исторической экспертизой. Реальные результаты каждой сессии сохранены в журнале задачи. Сырые browsertraces/cache остаются локально и не публикуются как исходныйкод.

${audit}
`);
console.log(state);console.log('Документация обновлена; предыдущие редакции сохранены.');
