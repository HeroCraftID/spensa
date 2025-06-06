# Base image
FROM node:20.18.0

# Set working directory
WORKDIR /app

# Copy semua isi folder ke container
COPY . .

# Install dependencies untuk project1 dan project2
RUN cd project1 && npm install
RUN cd project2 && npm install

# Build project kalau perlu (contoh Next.js)
RUN cd project1 && npm run build
RUN cd project2 && npm run build

# Jalankan kedua project dengan pm2 atau concurrently
# Contoh pakai pm2 supaya bisa jalanin 2 app bersamaan
RUN npm install -g pm2

# Start kedua project secara bersamaan
CMD ["pm2-runtime", "start", "project1/ecosystem.config.js", "--only", "project1", "--no-daemon", "--", "project2/ecosystem.config.js"]
