[![tests](https://github.com/paulodiovani/interactive-pbta-bot/actions/workflows/test.yml/badge.svg?branch=main)][tests-action]
[![linters](https://github.com/paulodiovani/interactive-pbta-bot/actions/workflows/linters.yml/badge.svg?branch=main)][linters-action]

[tests-action]: https://github.com/paulodiovani/interactive-pbta-bot/actions/workflows/test.yml
[linters-action]: https://github.com/paulodiovani/interactive-pbta-bot/actions/workflows/linters.yml

# Interactive PbtA Bot 🤖

An Interactive Discord Bot for pbta games, using slash commands to trigger moves.

## Usage

- Install the bot into your Discord server from [one of the links below](#supported-games-and-languages), or
- [Deploy and create your own bot](#deploy-and-create-a-bot)

### Move commands

The bot use slash commands available with `/move` (default command).

You can also search for commands by typing any word matching the command name. Check the example below.

![usage sample](./media/usage-sample.gif)

## Contributing

### Local development

1. Create a Discord App through the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on **Bot** on the left panel, add a new Bot and copy its **TOKEN**
3. Click on OAuth2 and then on URL Generator on the left panel and select
    + Scopes: **bot**, **application.commands**
    + Bot Permissions: **Use Slash Commands**
4. Follow the URL to add to your server
5. Copy `.env.sample` to `.env` and fill the `TOKEN`
6. Set the `MOVELIST` path to the YAML file with the moves and translations.
    + You can use one of the included in the [`/moves`](moves/) directory or create your own.
    + Check the [Add games or translations](#add-games-or-translations) section for more info.
7. (optional) Change other settings in `.env` according to your preferences.
8. `npm install` to install dependencies
9. `npm run dev` to run

### Add games or translations

There is a currently small list of oficial [supported games and languages](#supported-games-and-languages)
for this bot, you can contribute to this list by adding more games or translating the existing ones
to more languages.

1. Check the existing ones on the [`/moves`](moves/) directory
2. Create a new file with the format `game-name.locale.yml`
3. Edit the YAML file with the contents for the new game moves, or new language texts
    + You can use a translation app, we recommend https://poeditor.com
4. (optional) Open a Pull Request to include the new file

## Deploy and create a bot

You can create your own bot and deploy to a server of your preference.
We recommend [heroku](https://heroku.com), but you can deploy anywhere you like.

[![Deploy to heroku](https://www.herokucdn.com/deploy/button.svg)][heroku-deploy]

1. Follow steps `1` to `4` from [Local development](#local-development)
2. [Deploy to heroku][heroku-deploy] or your preferred server
3. Fill the `TOKEN` and `MOVELIST` env vars and set the others according to your preferences

## Supported games and languages

| Game                | Language  | Status/Content  | Discord bots
| --                  | --        | --              | --
| Apocalypse World    | en-US     | Basic moves     | [Add Apocalypse World bot](https://discord.com/api/oauth2/authorize?client_id=976286129517121586&permissions=2147483648&scope=bot%20applications.commands)
|                     | pt-BR     | Basic moves     |

[heroku-deploy]: https://heroku.com/deploy?template=https://github.com/paulodiovani/interactive-pbta-bot
