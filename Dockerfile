FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

COPY . .

RUN npm ci

RUN npm run build

COPY . .

FROM node:18-alpine

#ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY --from=builder /usr/src/app/dist ./dist
#COPY --from=builder . .

EXPOSE 8443
CMD [ "node", "dist/informer.js" ]
