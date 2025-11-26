# MyReactApp/Dockerfile
# Стадия сборки
FROM node:20-alpine AS build

# === КЛЮЧЕВОЙ МОМЕНТ: Обновляем npm до последней стабильной версии ===
# Это обходит баги в версиях 10.8.0+, описанные в issue #8179
RUN npm install -g npm@latest

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
ENV NODE_ENV=development
RUN npm ci

# Копируем исходный код
COPY . .

# Выполняем сборку
RUN npm run build

# Стадия запуска
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]