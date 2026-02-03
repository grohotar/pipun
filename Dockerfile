# Stage 1: Build Hugo site
FROM hugomods/hugo:exts as builder

WORKDIR /src
COPY . .
RUN hugo --minify --cleanDestinationDir

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built site
COPY --from=builder /src/public /usr/share/nginx/html

# Copy nginx config (optional, if needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
