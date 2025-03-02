# Используем официальный образ Node.js в качестве базового
FROM node:18-buster

# Активируем corepack
RUN corepack enable


RUN apt-get update && apt-get install -y \
    build-essential \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем только файлы package.json и yarn.lock, чтобы оптимизировать сборку
COPY package.json yarn.lock ./


# Отключаю pnp и использую node_modules
RUN yarn config set nodeLinker node-modules

# Устанавливаем зависимости
RUN yarn set version berry && yarn install

# Копируем остальные файлы проекта в контейнер
COPY . .

RUN yarn add sqlite3

# Компилируем приложение (если используется TypeScript)
RUN yarn build

# Указываем порт, который будет использовать приложение
EXPOSE 3000

# Определяем команду для запуска приложения
CMD ["yarn", "start:prod"]
