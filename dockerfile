# Используем официальный образ Node.js в качестве базового
FROM node:18-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем только файлы package.json и yarn.lock, чтобы оптимизировать сборку
COPY package.json yarn.lock ./

# Активируем corepack и обновляем последнюю доступную версию yarn
RUN corepack enable && yarn set version berry

# Отключаю pnp и использую node_modules
RUN yarn config set nodeLinker node-modules

# Устанавливаем зависимости
RUN yarn install 

# Копируем остальные файлы проекта в контейнер
COPY . .

# Компилируем приложение (если используется TypeScript)
RUN yarn build

# Указываем порт, который будет использовать приложение
EXPOSE 3000

# Определяем команду для запуска приложения
CMD ["yarn", "start:prod"]
