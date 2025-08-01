# Технологический стек

## Система сборки и управление пакетами

- **Менеджер пакетов**: Yarn 4.9.1 с workspaces
- **Структура монорепо**: Два основных пакета (`@feedback/front`, `@feedback/back`)
- **Управление окружением**: dotenv-cli для инъекции переменных окружения

## Стек бэкенда

- **Среда выполнения**: Node.js с TypeScript
- **Фреймворк**: Fastify с плагинами для CORS, ограничения скорости и валидации Zod
- **База данных**: PostgreSQL 15 с Prisma ORM
- **Разработка**: ts-node-dev для горячей перезагрузки
- **Продакшн**: tsx для выполнения TypeScript
- **Отслеживание ошибок**: Интеграция с Sentry
- **Валидация API**: Zod схемы с fastify-zod

## Стек фронтенда

- **Фреймворк**: React 18 с TypeScript
- **Инструмент сборки**: Vite с SWC для быстрой компиляции
- **UI библиотека**: VK UI (@vkontakte/vkui) для нативного VK стиля
- **Стилизация**: Tailwind CSS с интеграцией VK UI
- **Управление состоянием**: Zustand для клиентского состояния
- **Получение данных**: SWR для управления серверным состоянием
- **Роутинг**: React Router DOM
- **Интеграция VK**: VK Bridge, VK Tunnel для разработки
- **Аналитика**: Интеграция с Яндекс.Метрикой
- **Отслеживание ошибок**: Sentry с плагином Vite

## Инструменты разработки

- **Линтинг**: ESLint с правилами React и TypeScript
- **Форматирование**: Prettier
- **Git хуки**: Husky для проверок перед коммитом
- **Проверка типов**: TypeScript в строгом режиме

## Инфраструктура

- **Контейнеризация**: Docker с многоэтапными сборками
- **База данных**: PostgreSQL с монтированием постоянного тома
- **Обратный прокси**: Traefik для SSL терминации и роутинга
- **Развертывание**: Docker Compose с продакшн конфигурацией

## Основные команды

### Команды корневого уровня

```bash
# Разработка фронтенда
yarn front:dev              # Запуск dev сервера фронтенда
yarn front:build            # Сборка фронтенда для продакшна
yarn front:deploy           # Сборка и деплой на VK хостинг

# Разработка бэкенда
yarn back:dev               # Запуск бэкенда с горячей перезагрузкой
yarn back:build            # Сборка TypeScript бэкенда
yarn back:start            # Запуск продакшн бэкенда

# Операции с базой данных
yarn back:prisma:generate   # Генерация Prisma клиента
yarn back:prisma:migrate    # Запуск миграций базы данных
yarn back:prisma:studio     # Открытие Prisma Studio

# Проверки качества
yarn ts:check              # Проверка типов всех пакетов
yarn lint                  # Линтинг всех пакетов
yarn prettify             # Форматирование кода с Prettier
```

### Команды для конкретных пакетов

```bash
# Фронтенд (packages/front)
yarn dev                   # Сервер разработки
yarn build                # Продакшн сборка
yarn tunnel:vk            # VK туннель для разработки

# Бэкенд (packages/back)
yarn dev                  # Разработка с горячей перезагрузкой
yarn bench               # Запуск бенчмарков производительности
yarn tunnel              # SSH туннель для внешнего доступа
```

## Конфигурация окружения

- **Разработка**: Использует файл `.env` с инъекцией dotenv-cli
- **Продакшн**: Переменные окружения передаются через Docker
- **Интеграция VK**: Требует учетные данные VK приложения и конфигурацию callback
- **База данных**: Строки подключения PostgreSQL для локального и Docker окружений
