# Serverless Telegram Bot - Boilerplate
This boilerplate can be used as a starting point to create a serverless telegram bot that will be hosted as a Cloudflare Worker.

## Requirements
* either have `node` version **18.12.0** or have `nvm` installed so it can manage your version

## Installation
```
git clone git@github.com:realestninja/serverless-telegram-bot-boilerplate.git
cd serverless-telegram-bot-boilerplate
nvm use
yarn install
```

Add your bot token
```
echo 'BOT_TOKEN = "<bot token>"' >> .dev.vars
```

## Development
`yarn dev`

In dev mode, you can hit `l` to activate local mode.

With this [development-helper](https://github.com/realestninja/serverless-telegram-bot-development-helper) you can forward messages from your bot to the local instance of this boilerplate. (Check for correct ports)

## Deployment
`yarn deploy`, then follow the steps presented by Wrangler. After deployment, you should have received the url where the bot is hosted. This will be used as webhook.

## Set up the webhook
Lastly you need to set up the webhook.

Replace the sections in this url (bot token & webhook), then call it and your bot should be set up.

```https://api.telegram.org/bot<bot token>/setWebhook?url=<worker url>```
