# Requirements Document

## Introduction

Pipun VPN — многостраничный веб-сайт (витрина) для VPN-сервиса, работающего через Telegram-бота. Сайт не содержит личного кабинета, корзины или обработки платежей. Все действия покупки перенаправляют пользователя в Telegram-бота с deep linking параметрами для отслеживания источника.

## Glossary

- **Website**: Многостраничный сайт Pipun VPN
- **Telegram_Bot**: Бот @pipun_bot, куда перенаправляются все CTA-кнопки
- **Deep_Link**: Ссылка формата https://t.me/pipun_bot?start=web_{source}
- **CTA_Button**: Кнопка призыва к действию (Купить, Подключить, Попробовать)
- **Device_Page**: Страница категории устройств (iPhone, Android, Windows и т.д.)
- **Location_Page**: Страница категории локаций (Турция, Казахстан и т.д.)
- **Solution_Page**: Страница категории решений (Steam, Instagram и т.д.)
- **Sticky_CTA**: Фиксированная кнопка внизу экрана на внутренних страницах

## Requirements

### Requirement 1: Глобальная навигация

**User Story:** Как пользователь, я хочу иметь единую навигацию на всех страницах, чтобы легко перемещаться по сайту.

#### Acceptance Criteria

1. THE Website SHALL display a header with logo "Pipun VPN" on all pages
2. THE Website SHALL display navigation menu with items: Устройства, Локации, Помощь
3. THE Website SHALL display a CTA button "Войти в бота" with pink gradient in the header
4. WHEN user clicks "Войти в бота" button THEN THE Website SHALL redirect to https://t.me/pipun_bot?start=web_header
5. THE Website SHALL display a footer with links: Поддержка (@pipunhelper), Оферта, Политика
6. THE Website SHALL display text "Работает на стелс-протоколах" in the footer

### Requirement 2: Главная страница — Hero секция

**User Story:** Как посетитель, я хочу сразу понять ценность сервиса и иметь возможность быстро перейти к покупке.

#### Acceptance Criteria

1. WHEN user visits the home page THEN THE Website SHALL display hero section with headline "VPN, который работает, когда другие заблокированы"
2. THE Website SHALL display subheadline "Доступ к Instagram, YouTube 4K и Steam. Одна подписка на 5 устройств"
3. THE Website SHALL display CTA button "Подключить через Telegram" in hero section
4. WHEN user clicks hero CTA button THEN THE Website SHALL redirect to https://t.me/pipun_bot?start=web_home

### Requirement 3: Главная страница — Сетка устройств

**User Story:** Как пользователь, я хочу видеть поддерживаемые устройства и быстро перейти к инструкции для моего устройства.

#### Acceptance Criteria

1. THE Website SHALL display device grid section on home page with cards for: iPhone, Android, Windows, macOS, Android TV, Apple TV
2. WHEN user clicks on a device card THEN THE Website SHALL navigate to corresponding device page
3. THE Website SHALL display an icon and name for each device card

### Requirement 4: Главная страница — Сетка решений

**User Story:** Как пользователь, я хочу видеть какие сервисы работают через VPN и перейти к деталям.

#### Acceptance Criteria

1. THE Website SHALL display solutions grid section on home page with cards for: Instagram, YouTube, Steam, PS Store, Canva, Adobe, Midjourney, AI (ChatGPT/Claude)
2. WHEN user clicks on a solution card THEN THE Website SHALL navigate to corresponding solution page
3. THE Website SHALL display an icon and name for each solution card

### Requirement 5: Главная страница — Тарифы

**User Story:** Как потенциальный клиент, я хочу видеть цены и выбрать подходящий тариф.

#### Acceptance Criteria

1. THE Website SHALL display pricing section with 5 tariff cards
2. THE Website SHALL display tariff "1 Неделя" with price 149 RUB
3. THE Website SHALL display tariff "1 Месяц" with price 289 RUB and fire icon 🔥 with label "ХИТ"
4. THE Website SHALL display tariff "3 Месяца" with price 789 RUB and discount label "-10%"
5. THE Website SHALL display tariff "6 Месяцев" with price 1489 RUB and discount label "-15%"
6. THE Website SHALL display tariff "12 Месяцев" with price 2689 RUB and discount label "-25%"
7. THE Website SHALL display note "Принимаем карты РФ и Крипту в боте" below pricing cards
8. WHEN user clicks on any tariff card THEN THE Website SHALL redirect to https://t.me/pipun_bot?start=web_pricing

### Requirement 6: Главная страница — Технологии и FAQ

**User Story:** Как пользователь, я хочу понять технические преимущества и найти ответы на частые вопросы.

#### Acceptance Criteria

1. THE Website SHALL display technology section with text "Современные протоколы — невидимы для блокировок"
2. THE Website SHALL display text "Авто-обновление подписки" in technology section
3. THE Website SHALL display FAQ section with accordion component
4. THE Website SHALL include FAQ item "Как платить?" with answer
5. THE Website SHALL include FAQ item "Сложно настроить?" with answer
6. WHEN user clicks on FAQ question THEN THE Website SHALL expand/collapse the answer

### Requirement 7: Страницы устройств

**User Story:** Как пользователь конкретного устройства, я хочу получить инструкцию по настройке VPN.

#### Acceptance Criteria

1. THE Website SHALL have device pages at routes: /iphone, /android, /windows, /macos, /android-tv, /apple-tv
2. WHEN user visits a device page THEN THE Website SHALL display hero with device-specific headline
3. THE Website SHALL display main benefit text explaining why Pipun VPN is needed for this device
4. THE Website SHALL display instruction block with 3 steps: 1) Перейдите в бота и оплатите подписку, 2) Скачайте приложение (device-specific app name), 3) Вставьте ссылку
5. THE Website SHALL display sticky CTA button "Получить ключ в Telegram" at bottom of screen
6. WHEN user clicks sticky CTA on device page THEN THE Website SHALL redirect to https://t.me/pipun_bot?start=web_{device_name}

### Requirement 8: Страницы локаций

**User Story:** Как пользователь, желающий получить доступ к контенту определенной страны, я хочу узнать о возможностях VPN для этой локации.

#### Acceptance Criteria

1. THE Website SHALL have location pages at routes: /turkey, /kazakhstan, /argentina, /usa, /germany, /netherlands
2. WHEN user visits a location page THEN THE Website SHALL display hero with location-specific headline
3. THE Website SHALL display main benefit text with focus on specific services (e.g., Steam/PS Store for Turkey, Xbox for Argentina)
4. THE Website SHALL display instruction block with 3 steps
5. THE Website SHALL display sticky CTA button "Получить ключ в Telegram"
6. WHEN user clicks sticky CTA on location page THEN THE Website SHALL redirect to https://t.me/pipun_bot?start=web_{location_name}

### Requirement 9: Страницы решений

**User Story:** Как пользователь, желающий разблокировать конкретный сервис, я хочу узнать как VPN поможет мне.

#### Acceptance Criteria

1. THE Website SHALL have solution pages at routes: /instagram, /youtube, /steam, /ps-store, /canva, /adobe, /midjourney, /ai
2. WHEN user visits a solution page THEN THE Website SHALL display hero with solution-specific headline
3. THE Website SHALL display main benefit text explaining how VPN helps access this service
4. THE Website SHALL display instruction block with 3 steps
5. THE Website SHALL display sticky CTA button "Получить ключ в Telegram"
6. WHEN user clicks sticky CTA on solution page THEN THE Website SHALL redirect to https://t.me/pipun_bot?start=web_{solution_name}

### Requirement 10: Deep Linking

**User Story:** Как владелец сервиса, я хочу отслеживать источники переходов в бота для аналитики.

#### Acceptance Criteria

1. WHEN user clicks any CTA button THEN THE Website SHALL include source parameter in Telegram deep link
2. THE Website SHALL use format https://t.me/pipun_bot?start=web_{source} for all deep links
3. THE Website SHALL use unique source identifiers for each page (e.g., web_turkey, web_iphone, web_steam)

### Requirement 11: Дизайн и стиль

**User Story:** Как пользователь, я хочу видеть современный, привлекательный дизайн сайта.

#### Acceptance Criteria

1. THE Website SHALL use dark gray / deep charcoal background color (not pure black)
2. THE Website SHALL use neon pink / fuchsia (#FF00FF) as accent color for buttons, glow effects, and icons
3. THE Website SHALL use clean, bold sans-serif typography (Inter or Roboto)
4. THE Website SHALL use rounded corners on UI elements
5. THE Website SHALL apply glassmorphism effect on cards
6. THE Website SHALL use contrasting white text
7. THE Website SHALL be mobile-first responsive

### Requirement 12: Техническая реализация

**User Story:** Как разработчик, я хочу использовать современные технологии для быстрой и качественной разработки.

#### Acceptance Criteria

1. THE Website SHALL use semantic HTML5
2. THE Website SHALL use Tailwind CSS for styling
3. THE Website SHALL ensure fast page load times
4. THE Website SHALL implement client-side navigation between pages
