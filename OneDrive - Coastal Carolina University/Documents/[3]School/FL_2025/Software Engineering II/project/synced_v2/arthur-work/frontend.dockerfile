FROM node:22.19

# Working dir
WORKDIR /app

# Dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# React code
COPY frontend/ .

EXPOSE 5173

CMD ["npm", "run", "dev"]