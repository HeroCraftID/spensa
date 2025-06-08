# Gunakan image resmi Node.js
FROM node:20.18.0

# Set working directory
WORKDIR /app

# Copy semua file ke dalam container
COPY . .

# Install dependencies untuk admin dan client
RUN cd admin && npm install --force && npm run build
RUN cd Client && npm install --force && npm run build

# Install pm2 secara global
RUN npm install -g pm2

# Buat file ekosistem PM2 secara manual jika belum ada
# Misal, masing-masing di `admin/ecosystem.config.js` dan `client/ecosystem.config.js`

# Jalankan kedua proyek secara bersamaan menggunakan pm2-runtime
CMD pm2-runtime start admin/ecosystem.config.js --only admin && \
    pm2-runtime start client/ecosystem.config.js --only client
