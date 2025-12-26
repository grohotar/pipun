# Implementation Plan: Pipun VPN Website

## Overview

Реализация многостраничного сайта-витрины для Pipun VPN на Hugo с SCSS. Контент в Markdown файлах, данные в YAML, единые шаблоны для всех типов страниц.

## Tasks

- [x] 1. Настройка Hugo проекта
  - [x] 1.1 Инициализировать Hugo проект
    - Создать структуру папок Hugo
    - Создать hugo.toml с базовой конфигурацией
    - _Requirements: 12.1, 12.2_
  - [x] 1.2 Создать SCSS структуру
    - Создать assets/scss/main.scss
    - Создать _variables.scss с цветами и переменными
    - Создать _base.scss с базовыми стилями
    - Создать _components.scss для кнопок и карточек
    - Создать _layout.scss для header, footer, grid
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  - [x] 1.3 Создать main.js для интерактивности
    - FAQ accordion toggle
    - Mobile menu toggle
    - _Requirements: 6.6_

- [x] 2. Базовые шаблоны Hugo
  - [x] 2.1 Создать baseof.html
    - HTML5 структура
    - Meta теги, viewport
    - Подключение SCSS через Hugo Pipes
    - Подключение JS
    - _Requirements: 12.1_
  - [x] 2.2 Создать partial header.html
    - Лого "Pipun VPN"
    - Навигация (Устройства, Локации, Помощь)
    - CTA кнопка с deep link
    - Mobile menu button
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 2.3 Создать partial footer.html
    - Лого
    - Ссылки: Поддержка, Оферта, Политика
    - Текст про стелс-протоколы
    - _Requirements: 1.5, 1.6_
  - [x] 2.4 Создать partial sticky-cta.html
    - Фиксированная кнопка для мобильных
    - Deep link из front matter
    - _Requirements: 7.5, 8.5, 9.5_

- [x] 3. Главная страница
  - [x] 3.1 Создать layouts/index.html
    - Hero секция с заголовком и CTA
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 3.2 Добавить секцию устройств
    - Сетка из 6 карточек
    - Ссылки на внутренние страницы
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 3.3 Добавить секцию решений
    - Сетка из 8 карточек
    - Ссылки на внутренние страницы
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 3.4 Создать data/pricing.yaml и секцию тарифов
    - 5 тарифов с ценами
    - Бейдж ХИТ, скидки
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_
  - [x] 3.5 Добавить секцию технологий
    - Текст про протоколы и авто-обновление
    - _Requirements: 6.1, 6.2_
  - [x] 3.6 Создать data/faq.yaml и секцию FAQ
    - Accordion компонент
    - Вопросы и ответы
    - _Requirements: 6.3, 6.4, 6.5, 6.6_
  - [x] 3.7 Создать content/_index.md
    - Front matter для главной страницы
    - _Requirements: 2.1_

- [x] 4. Checkpoint - Проверка главной страницы
  - Запустить hugo server
  - Проверить отображение всех секций
  - Проверить адаптивность

- [x] 5. Шаблон внутренних страниц
  - [x] 5.1 Создать layouts/_default/single.html
    - Hero с иконкой и заголовком из front matter
    - Блок инструкций (3 шага)
    - Desktop CTA
    - Sticky CTA для мобильных
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 6. Контент страниц устройств
  - [x] 6.1 Создать content/devices/iphone.md
    - _Requirements: 7.1, 7.6, 10.3_
  - [x] 6.2 Создать content/devices/android.md
    - _Requirements: 7.1, 7.6, 10.3_
  - [x] 6.3 Создать content/devices/windows.md
    - _Requirements: 7.1, 7.6, 10.3_
  - [x] 6.4 Создать content/devices/macos.md
    - _Requirements: 7.1, 7.6, 10.3_
  - [x] 6.5 Создать content/devices/android-tv.md
    - _Requirements: 7.1, 7.6, 10.3_
  - [x] 6.6 Создать content/devices/apple-tv.md
    - _Requirements: 7.1, 7.6, 10.3_

- [x] 7. Контент страниц локаций
  - [x] 7.1 Создать content/locations/turkey.md
    - _Requirements: 8.1, 8.2, 8.3, 8.6, 10.3_
  - [x] 7.2 Создать content/locations/kazakhstan.md
    - _Requirements: 8.1, 8.6, 10.3_
  - [x] 7.3 Создать content/locations/argentina.md
    - _Requirements: 8.1, 8.3, 8.6, 10.3_
  - [x] 7.4 Создать content/locations/usa.md
    - _Requirements: 8.1, 8.6, 10.3_
  - [x] 7.5 Создать content/locations/germany.md
    - _Requirements: 8.1, 8.6, 10.3_
  - [x] 7.6 Создать content/locations/netherlands.md
    - _Requirements: 8.1, 8.6, 10.3_

- [x] 8. Контент страниц решений
  - [x] 8.1 Создать content/solutions/instagram.md
    - _Requirements: 9.1, 9.6, 10.3_
  - [x] 8.2 Создать content/solutions/youtube.md
    - _Requirements: 9.1, 9.3, 9.6, 10.3_
  - [x] 8.3 Создать content/solutions/steam.md
    - _Requirements: 9.1, 9.3, 9.6, 10.3_
  - [x] 8.4 Создать content/solutions/ps-store.md
    - _Requirements: 9.1, 9.6, 10.3_
  - [x] 8.5 Создать content/solutions/canva.md
    - _Requirements: 9.1, 9.6, 10.3_
  - [x] 8.6 Создать content/solutions/adobe.md
    - _Requirements: 9.1, 9.6, 10.3_
  - [x] 8.7 Создать content/solutions/midjourney.md
    - _Requirements: 9.1, 9.6, 10.3_
  - [x] 8.8 Создать content/solutions/ai.md
    - _Requirements: 9.1, 9.6, 10.3_

- [x] 9. Checkpoint - Проверка всех страниц
  - Проверить все 20 внутренних страниц
  - Убедиться в единообразии структуры
  - Проверить все deep links

- [ ] 10. Тестирование
  - [ ]* 10.1 Написать property test для Header/Footer Consistency
    - **Property 1: Header and Footer Consistency**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.5, 1.6**
  - [ ]* 10.2 Написать property test для Deep Link Format
    - **Property 5: Deep Link Format Correctness**
    - **Validates: Requirements 10.1, 10.2**
  - [ ]* 10.3 Написать property test для Deep Link Uniqueness
    - **Property 6: Deep Link Source Uniqueness**
    - **Validates: Requirements 10.3**

- [x] 11. Final Checkpoint
  - Запустить hugo build
  - Проверить сгенерированные файлы в public/
  - Валидация HTML

## Notes

- Задачи с `*` являются опциональными
- Hugo автоматически компилирует SCSS через Hugo Pipes
- Контент страниц в Markdown с YAML front matter
- Данные (тарифы, FAQ) в data/*.yaml
- Для запуска: `hugo server -D`
- Для сборки: `hugo`
