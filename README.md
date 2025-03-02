# Template TypeScript NestJS App

Это шаблон проекта для создания приложений на **NestJS** с использованием **TypeScript**. Проект предоставляет основу для быстрого старта, включая Docker-контейнеризацию.

## Требования

- **Docker**: для сборки и запуска контейнеров.
- **Node.js** и **npm** (или **Yarn**) для работы с проектом на локальной машине.

## Установка

1. Клонируйте репозиторий:

```bash
   git clone https://github.com/ibah111/template-typescript-nestjs-app.git
   cd template-typescript-nestjs-app
```

### Соберите Docker-образ

```bash
docker build -t template .
```

### Запустите контейнер

```bash
docker run -d -p 3000:3000 --name template-container template
```

### Контейнер будет запущен в фоновом режиме и доступен по адресу <http://localhost:3000>

Чтобы остановить контейнер:

```bash
docker stop template-container
```

### Чтобы удалить контейнер

```bash
docker rm template-container
```
