FROM node:16-alpine
ENV NODE_ENV=production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
EXPOSE 3000
CMD [ "yarn", "start" ]

# ARG PNPM_VERSION=7.0.0-rc.9
# ARG NODE_VERSION=16
#
# FROM node:${NODE_VERSION}-alpine
# ENV NODE_ENV=production
#
# RUN mkdir -p /usr/src/app
# RUN npm --no-update-notifier --no-fund --global install pnpm@${PNPM_VERSION}
# WORKDIR /usr/src/app
# COPY . .
# # RUN pnpm -r update
# RUN pnpm install
# # RUN pnpm build
#
# EXPOSE 3000
# CMD [ "pnpm", "run", "dev" ]