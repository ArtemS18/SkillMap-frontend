# --- Stage 1: Build the React application ---
FROM node:20-alpine AS build
WORKDIR /app
COPY skill-map/package*.json ./
RUN npm install
COPY skill-map/ ./
RUN npm run build

# --- Stage 2: Serve the static files with Nginx ---
FROM nginx:alpine AS server
# Copy built assets from the build stage to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80 (Nginx default)
EXPOSE 80
# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
