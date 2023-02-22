FROM node:19

WORKDIR /app

# Install Dependencies
COPY ./package.json /app
RUN npm install

# Create Prisma Config
COPY ./prisma /app
RUN npm install -g prisma
RUN npx prisma generate

# Build
COPY ./src /app/src
COPY ./tsconfig.json /app
RUN npm run build

CMD prisma migrate deploy && npm start
