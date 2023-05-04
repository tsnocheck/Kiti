import {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes
} from "discord.js";
import {
    readdirSync,
    unlinkSync
} from 'fs';
import {CLIENT_TOKEN, CLIENT_ID, OWNER_ID, TEST_SERVER_ID} from '../config/config.json';
export class TypeScriptBot extends Client {
    commands_collection = new Collection<string, object>();
    commands = [];

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping
            ],
            presence: {
                activities: [{
                    name: 'Starting up...',
                    type: ActivityType.Playing
                }]
            }
        });
    };
    public async load_commands(auto_deploy?: boolean) {
        const commandsToDelete = [];

        for (const directory of readdirSync('./dist/commands/')) {
            for (const file of readdirSync('./dist/commands/' + directory + '/').filter((f) => f.endsWith('.js'))) {
                const command = require('../commands/' + directory + '/' + file).default; // Because we are exporting the files with 'default' keyword.

                if (command.command_data && typeof command.command_data === 'object' && command.command_data?.name) {
                    if (this.commands_collection.has(command.command_data?.name)) {
                        console.warn('[WARN] The file ' + file + ' is having the same property \'command_data.name\' from another file, this file has been skipped.');

                        continue;
                    };

                    this.commands.push(command.command_data);

                    this.commands_collection.set(command.command_data?.name, command);

                    console.log('Loaded a new command file: ' + file);
                } else {
                    console.warn('[WARN] The file ' + file + ' has been skipped due to missing property of \'command_data\' or \'command_data.name\'.');

                    continue;
                };
            };
        };

        for (const [commandName, command] of this.commands_collection.entries()) {
            if (!this.commands.find((cmd) => cmd.name === commandName)) {
                commandsToDelete.push(commandName);
            }
        }

        for (const commandName of commandsToDelete) {
            this.commands_collection.delete(commandName);
            console.log(`Command "${commandName}" was removed.`);
        }

        if (auto_deploy) {
            this.deploy_commands();
        };

        return this;
    };

    public async load_modules() {
        const moduleDir = './dist/modules/';
        
        for (const directory of readdirSync(moduleDir)) {
          for (const file of readdirSync(moduleDir + directory + '/').filter((f) => f.endsWith('.js'))) {
            const module = require(`../modules/${directory}/${file}`).default;
      
            if (typeof module === 'function') {
              module(this);
              console.log(`Loaded a new module: ${directory}/${file}`);
            } else {
              console.error(`Module ${directory}/${file} does not export a function!`);
            }
          };
        };
        
        return this;
      };

    public async load_events() {
        for (const directory of readdirSync('./dist/events/')) {
            for (const file of readdirSync('./dist/events/' + directory + '/').filter((f) => f.endsWith('.js'))) {
                require('../events/' + directory + '/' + file);

                console.log('Loaded a new event file: ' + file);
            };
        };

        return this;
    };

    public async deploy_commands() {
        const rest = new REST({
            version: '10'
        }).setToken(CLIENT_TOKEN);

        // Making sure that the ID of the test server is 100% provided or not by using 'length' property.
        if (TEST_SERVER_ID && TEST_SERVER_ID?.length > 3) {
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, TEST_SERVER_ID), {
                    body: this.commands
                }
            );
        } else {
            await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: this.commands }
            );
        };

        return this;
    };
    public async delete_command(command_name: string, auto_deploy?: boolean) {
        if (!this.commands_collection.has(command_name)) return;

        this.commands_collection.delete(command_name);

        if (auto_deploy) {
            this.deploy_commands();
        };

        return this;
    };

    private async restart() {
        this.destroy();

        this.start();

        return this;
    };

    public async start() {
        this.login(CLIENT_TOKEN)
            .catch((err) => {
                console.error('[ERROR] Failed to login to the Discord bot.\n' + err);
            });

        return this;
    };
};