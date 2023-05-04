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
const index_1 = require("../../index");
const config_json_1 = require("../../config/config.json");
index_1.client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isChatInputCommand()) {
        const command = index_1.client.commands_collection.get(interaction.commandName);
        if (!command)
            return;
        try {
            if (command['options_data']) {
                if (command['options_data']['owner_only']) {
                    if (interaction.user.id !== config_json_1.OWNER_ID) {
                        yield interaction.reply({
                            content: 'This command is for the owner only!',
                            ephemeral: true
                        });
                        return;
                    }
                    ;
                }
                ;
            }
            ;
            command['run'](index_1.client, interaction, interaction.options);
        }
        catch (err) {
            console.error('[ERROR] Something went wrong with the command \'' + interaction.commandName + '\'.\n' + err);
        }
        ;
    }
}));
