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
const client_1 = require("../../config/client");
const discord_js_1 = require("discord.js");
index_1.client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Logged in as ' + index_1.client.user.tag + '.');
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const activity_chosen = client_1.client_config.activities[Math.floor(Math.random() * client_1.client_config.activities.length)];
        index_1.client.user.setPresence({
            status: activity_chosen.status ? discord_js_1.PresenceUpdateStatus[activity_chosen.status] : 'online',
            activities: [{
                    name: activity_chosen.name,
                    type: activity_chosen.type,
                }]
        });
    }), 7500);
}));
