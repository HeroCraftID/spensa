# Gunakan image resmi Node.js
FROM node:20.18.0

# Set working directory
WORKDIR /app

# Copy semua file ke dalam container
COPY . .

# Install dependencies dan build untuk admin dan client
RUN cd admin && npm install --force && npm run build
RUN cd Client && npm install --force && npm run build

# Install pm2 secara global
RUN npm install -g pm2

# Salin ecosystem config (atau pastikan sudah di-copy saat `COPY . .`)
# Jalankan kedua aplikasi sekaligus
CMD ["pm2-runtime", "ecosystem.config.js"]
