# Production Stage
FROM node as production

WORKDIR /app

# Copy only package.json and package-lock.json to optimize caching
COPY package.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Application entry point
CMD ["npm","run" , "lprod"]
