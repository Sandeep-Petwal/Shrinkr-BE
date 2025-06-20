# FROM ubuntu

# RUN apt-get update && \
#     apt-get install -y curl && \
#     curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
#     apt-get install -y nodejs && \
#     apt-get clean

FROM node

# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install app dependencies
RUN npm install 
 
# Copy the rest of the application code
COPY . .


# Define the command to run your app
ENTRYPOINT ["npm", "start"]
