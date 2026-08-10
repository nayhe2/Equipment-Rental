# --- Etap 1: build ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Na produkcji VITE_API_BASE_URL NIE jest ustawiane (patrz axiosInstance.ts) —
# requesty idą pod ten sam adres co strona (np. "/api/..."), a nginx poniżej
# przekierowuje /api do kontenera backendu. Dzięki temu nie trzeba wpisywać
# adresu backendu na sztywno ani konfigurować CORS.
RUN npm run build

# --- Etap 2: runtime ---
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
