"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptBot = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const config_json_1 = require("../config/config.json");
class TypeScriptBot extends discord_js_1.Client {
    constructor() {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
                discord_js_1.GatewayIntentBits.GuildIntegrations,
                discord_js_1.GatewayIntentBits.GuildWebhooks,
                discord_js_1.GatewayIntentBits.GuildInvites,
                discord_js_1.GatewayIntentBits.GuildVoiceStates,
                discord_js_1.GatewayIntentBits.GuildPresences,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.GuildMessageReactions,
                discord_js_1.GatewayIntentBits.GuildMessageTyping,
                discord_js_1.GatewayIntentBits.DirectMessages,
                discord_js_1.GatewayIntentBits.DirectMessageReactions,
                discord_js_1.GatewayIntentBits.DirectMessageTyping
            ],
            presence: {
                activities: [{
                        name: 'Starting up...',
                        type: discord_js_1.ActivityType.Playing
                    }]
            }
        });
        this.commands_collection = new discord_js_1.Collection();
        this.commands = [];
    }
    ;
    load_commands(auto_deploy) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const commandsToDelete = [];
            for (const directory of (0, fs_1.readdirSync)('./dist/commands/')) {
                for (const file of (0, fs_1.readdirSync)('./dist/commands/' + directory + '/').filter((f) => f.endsWith('.js'))) {
                    const command = require('../commands/' + directory + '/' + file).default; // Because we are exporting the files with 'default' keyword.
                    if (command.command_data && typeof command.command_data === 'object' && ((_a = command.command_data) === null || _a === void 0 ? void 0 : _a.name)) {
                        if (this.commands_collection.has((_b = command.command_data) === null || _b === void 0 ? void 0 : _b.name)) {
                            console.warn('[WARN] The file ' + file + ' is having the same property \'command_data.name\' from another file, this file has been skipped.');
                            continue;
                        }
                        ;
                        this.commands.push(command.command_data);
                        this.commands_collection.set((_c = command.command_data) === null || _c === void 0 ? void 0 : _c.name, command);
                        console.log('Loaded a new command file: ' + file);
                    }
                    else {
                        console.warn('[WARN] The file ' + file + ' has been skipped due to missing property of \'command_data\' or \'command_data.name\'.');
                        continue;
                    }
                    ;
                }
                ;
            }
            ;
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
            }
            ;
            return this;
        });
    }
    ;
    load_modules() {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleDir = './dist/modules/';
            for (const directory of (0, fs_1.readdirSync)(moduleDir)) {
                for (const file of (0, fs_1.readdirSync)(moduleDir + directory + '/').filter((f) => f.endsWith('.js'))) {
                    const module = require(`../modules/${directory}/${file}`).default;
                    if (typeof module === 'function') {
                        module(this);
                        console.log(`Loaded a new module: ${directory}/${file}`);
                    }
                    else {
                        console.error(`Module ${directory}/${file} does not export a function!`);
                    }
                }
                ;
            }
            ;
            return this;
        });
    }
    ;
    load_events() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const directory of (0, fs_1.readdirSync)('./dist/events/')) {
                for (const file of (0, fs_1.readdirSync)('./dist/events/' + directory + '/').filter((f) => f.endsWith('.js'))) {
                    require('../events/' + directory + '/' + file);
                    console.log('Loaded a new event file: ' + file);
                }
                ;
            }
            ;
            return this;
        });
    }
    ;
    deploy_commands() {
        return __awaiter(this, void 0, void 0, function* () {
            const rest = new discord_js_1.REST({
                version: '10'
            }).setToken(config_json_1.CLIENT_TOKEN);
            // Making sure that the ID of the test server is 100% provided or not by using 'length' property.
            if (config_json_1.TEST_SERVER_ID && (config_json_1.TEST_SERVER_ID === null || config_json_1.TEST_SERVER_ID === void 0 ? void 0 : config_json_1.TEST_SERVER_ID.length) > 3) {
                yield rest.put(discord_js_1.Routes.applicationGuildCommands(config_json_1.CLIENT_ID, config_json_1.TEST_SERVER_ID), {
                    body: this.commands
                });
            }
            else {
                yield rest.put(discord_js_1.Routes.applicationCommands(config_json_1.CLIENT_ID), { body: this.commands });
            }
            ;
            return this;
        });
    }
    ;
    delete_command(command_name, auto_deploy) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.commands_collection.has(command_name))
                return;
            this.commands_collection.delete(command_name);
            if (auto_deploy) {
                this.deploy_commands();
            }
            ;
            return this;
        });
    }
    ;
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.destroy();
            this.start();
            return this;
        });
    }
    ;
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.login(config_json_1.CLIENT_TOKEN)
                .catch((err) => {
                console.error('[ERROR] Failed to login to the Discord bot.\n' + err);
            });
            return this;
        });
    }
    ;
}
exports.TypeScriptBot = TypeScriptBot;
;
