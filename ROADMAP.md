# Parabellum — Product Development Roadmap

> Аналитическая платформа вооружённых конфликтов и потерь военной техники

---

## Текущее состояние (v0.1 — Foundation)

- [x] Nx monorepo: `apps/web` (Next.js 16) + `apps/admin-strapi` (Strapi v5)
- [x] Shared types: `packages/contracts` (domain models, Strapi transforms)
- [x] Landing page: hero, feature carousel, platform cards, blog preview, recent losses, charts
- [x] Strapi CMS: 7 content types (Country, Conflict, EquipmentCategory, EquipmentType, EquipmentLoss, Tag, UserReport)
- [x] i18n: English + Russian
- [x] UI: shadcn/ui (New York), Tailwind CSS 4, dark theme
- [x] Charts: Recharts (timeline area chart, category bar chart)
- [x] Animations: Framer Motion, Embla Carousel

---

## Phase 1 — Data Layer & CMS Integration

**Цель:** Подключить фронтенд к Strapi API, заменить mock-данные на реальные.

### Задачи

- [ ] Создать сервисный слой для Strapi API (`apps/web/src/services/strapi.ts`)
  - Использовать существующие трансформеры из `packages/contracts/src/strapi/transforms.ts`
  - `fetchLosses()`, `fetchConflicts()`, `fetchCategories()`, `fetchCountries()`, `fetchAnalytics()`
  - Пагинация, фильтрация, сортировка через Strapi query params
- [ ] Настроить environment variables (`STRAPI_API_URL`, `STRAPI_API_TOKEN`)
- [ ] Seed Strapi: скрипт для начального наполнения данными (страны, конфликты, категории техники)
- [ ] Заменить mock-данные на главной странице на реальные из API
- [ ] Кэширование: Next.js ISR / `revalidate` для статических страниц

**Стек:** Next.js Server Components, `fetch` API, ISR
**Зависимости:** Strapi должен быть развёрнут и доступен

---

## Phase 2 — Core Pages

**Цель:** Страницы для просмотра и поиска потерь техники.

### 2.1 — Страница конкретной потери (`/losses/[slug]`)

- [ ] Детальная страница: фото-галерея (evidence), карта с точкой, ТТХ техники
- [ ] Status badge, verification status, дата, источник
- [ ] Связанные потери (тот же тип техники или конфликт)
- [ ] SEO: `generateMetadata()` с OG-изображениями
- [ ] Breadcrumbs: Home → Conflict → Category → Loss

**Типы:** `EquipmentLoss`, `EquipmentType` из `packages/contracts`

### 2.2 — Каталог техники (`/equipment`)

- [ ] Список категорий с иерархией (parent → children из `EquipmentCategory`)
- [ ] Страница типа техники (`/equipment/[slug]`): описание, specifications (JSON), все потери данного типа
- [ ] Фильтр по стране-производителю

### 2.3 — Поиск и фильтры (`/search`)

- [ ] Full-text поиск по названию техники, описанию
- [ ] Фильтры:
  - Тип техники (category tree)
  - Страна-оператор
  - Конфликт
  - Статус (destroyed / damaged / captured / abandoned)
  - Верификация (pending / confirmed / disputed)
  - Диапазон дат
- [ ] Результаты: карточки потерь с пагинацией
- [ ] URL query params для шаринга фильтров
- [ ] shadcn: `Command` (search), `Popover` (filter dropdowns), `DatePicker`

**Новые shadcn компоненты:** command, popover, calendar, date-picker, pagination, breadcrumb, dialog, sheet (mobile filters)

---

## Phase 3 — Interactive Maps

**Цель:** Геопространственная визуализация потерь на карте.

### Задачи

- [ ] Интеграция картографической библиотеки (Mapbox GL JS или Leaflet + react-leaflet)
- [ ] Страница карты (`/map`):
  - Кластерные маркеры (используя `GeographicCluster` из contracts)
  - Heatmap-слой интенсивности потерь
  - Popup при клике: превью потери с фото и статусом
- [ ] Фильтры на карте: конфликт, тип техники, период, статус
- [ ] Timeline playback: анимация потерь на временной шкале (slider по датам)
- [ ] Спутниковый / стандартный вид карты
- [ ] Мобильная адаптация: sheet с фильтрами, touch-friendly маркеры

**Стек:** Mapbox GL JS (или Deck.gl для heatmaps), react-map-gl
**Типы:** `GeographicCluster`, `EquipmentLoss` (lat/lon)

---

## Phase 4 — Analytics & Dashboards

**Цель:** Расширенная аналитика, сравнения, тренды.

### Задачи

- [ ] Страница аналитики (`/analytics`):
  - Summary cards (используя существующий `SummaryStats`)
  - Timeline chart (существующий `TimelineChart`) с выбором периода
  - Category breakdown (существующий `CategoryBarChart`)
  - Новые графики: pie chart по статусам, treemap по категориям
- [ ] Сравнение конфликтов: side-by-side графики потерь
- [ ] Сравнение стран: таблица с сортировкой, bar chart
- [ ] Тренды: скользящие средние, прогнозные линии
- [ ] Экспорт: PNG графиков, CSV данных
- [ ] Dashboard builder: пользователь выбирает виджеты (stretch goal)

**Стек:** Recharts (уже установлен), возможно Tremor или Nivo для дополнительных типов графиков
**shadcn:** tabs (уже есть), tooltip, table, dropdown-menu

---

## Phase 5 — Blog / Analytical Posts

**Цель:** CMS-driven аналитический блог.

### Задачи

- [ ] Новый content type в Strapi: `BlogPost` (title, slug, content (richtext), excerpt, coverImage, author, tags, publishedAt)
- [ ] Новый тип в `packages/contracts`: `BlogPost` + Strapi трансформер
- [ ] Страница списка постов (`/blog`): карточки с превью, пагинация, фильтр по тегам
- [ ] Страница поста (`/blog/[slug]`): rich content rendering (MDX или Strapi richtext → HTML)
- [ ] SEO: OG-image генерация, structured data (Article schema)
- [ ] RSS-фид (`/blog/rss.xml`)
- [ ] Заменить mock-данные в `BlogPreview` компоненте на реальные

**Стек:** @strapi/blocks-react-renderer или custom richtext renderer

---

## Phase 6 — User Reports (Crowdsourced)

**Цель:** Позволить пользователям отправлять данные о потерях.

### Задачи

- [ ] Форма отправки (`/submit`):
  - Категория техники (select из Strapi)
  - Описание, дата, локация (ввод адреса → геокодирование)
  - Загрузка фото/видео (evidence)
  - URL источника
  - Email отправителя
- [ ] Валидация: zod schema, размер файлов, форматы
- [ ] API route для отправки в Strapi (`UserReport` content type уже есть)
- [ ] Модерация в Strapi admin: review pipeline (new → under_review → accepted/rejected)
- [ ] При accepted: автоматическое создание `EquipmentLoss` из `UserReport`
- [ ] Уведомление отправителю по email (статус отчёта)

**Стек:** React Hook Form + Zod, Strapi upload API
**shadcn:** form, input, textarea, file-upload

---

## Phase 7 — Advanced Features

**Цель:** API, оптимизация, расширенные возможности.

### 7.1 — Public API

- [ ] REST API для внешних потребителей (`/api/v1/losses`, `/api/v1/conflicts`, ...)
- [ ] Rate limiting, API keys
- [ ] Документация (Swagger / OpenAPI)
- [ ] Embed виджеты: iframe с графиком или картой для внешних сайтов

### 7.2 — Notifications & Updates

- [ ] Telegram-бот: уведомления о новых потерях
- [ ] Email-рассылка: еженедельный дайджест
- [ ] RSS-фид потерь (`/losses/rss.xml`)

### 7.3 — Performance & Infrastructure

- [ ] Edge caching (Vercel / Cloudflare)
- [ ] Image optimization: Next.js Image + Strapi media
- [ ] Database indexes для частых запросов (date, status, category)
- [ ] Мониторинг: error tracking (Sentry), analytics (Plausible/Umami)
- [ ] CI/CD: GitHub Actions → build → deploy

### 7.4 — Data Exports

- [ ] Экспорт в CSV / JSON / Excel
- [ ] Фильтрованный экспорт (выбранный конфликт, период, категория)
- [ ] Генерация PDF-отчётов

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5.9 |
| Styling | Tailwind CSS 4, shadcn/ui (New York) |
| Charts | Recharts |
| Maps | Mapbox GL JS / react-map-gl |
| Animations | Framer Motion, Embla Carousel |
| CMS | Strapi v5 (PostgreSQL) |
| i18n | next-intl (EN, RU) |
| Monorepo | Nx 22 |
| Types | @parabellum/contracts (shared) |
| Deployment | Vercel (web) + Railway/Render (Strapi) |

---

## Priority Order

```
Phase 1 (Data Layer)  →  обязательно первым, всё зависит от данных
Phase 2 (Core Pages)  →  основной функционал платформы
Phase 3 (Maps)        →  ключевая фича, визуальный импакт
Phase 5 (Blog)        →  контент для привлечения аудитории
Phase 4 (Analytics)   →  расширенная аналитика поверх данных
Phase 6 (Reports)     →  crowdsourcing после запуска
Phase 7 (Advanced)    →  масштабирование и API
```
