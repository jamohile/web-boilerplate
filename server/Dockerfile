FROM node:19

WORKDIR /app

# Install Dependencies
COPY ./package.json /app
RUN npm install

# Create Prisma Config
COPY ./prisma .
RUN npm install -g prisma
RUN npx prisma generate

# Build
COPY ./src .
COPY ./tsconfig.json .
RUN npm run build

CMD prisma migrate deploy && npm start
