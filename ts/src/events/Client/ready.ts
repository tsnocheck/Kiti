import { client } from '../../index';
import { client_config } from '../../config/client';
import { PresenceUpdateStatus } from 'discord.js';
client.once('ready', async () => {
    console.log('Logged in as ' + client.user.tag + '.');

    setInterval(async () => {
        const activity_chosen = client_config.activities[Math.floor(Math.random() * client_config.activities.length)];

        client.user.setPresence({
            status: activity_chosen.status ? PresenceUpdateStatus[activity_chosen.status] : 'online',
            activities: [{
                name: activity_chosen.name,
                type: activity_chosen.type,
            }]
        });
    }, 7500);
});
