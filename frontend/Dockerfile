FROM node:alpine as build

WORKDIR /app

# Copy package files and install dependencies   
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the frontend code
COPY . .

# Build the frontend application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]