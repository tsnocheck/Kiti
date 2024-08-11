import {ApplicationCommandDataResolvable, ApplicationCommandResolvable, Client, ClientOptions} from "discord.js";
import {ICommand} from "./Command";
import {IFeature} from "./Feature";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {IEvent} from "./Event";

class BotClient extends Client {
    commands: Map<string, ICommand>;
    features: Map<string, IFeature<unknown>>;
    constructor(options: ClientOptions) {
        super(options);

        this.commands = new Map<string, ICommand>();
        this.features = new Map<string, IFeature<unknown>>();
    }

    public async build(token: string) {
        try {
            console.log('Logging to client..')
            await super.login(token)
        } catch(e) {
            console.log(e)
            process.exit(1)
        }

        try {
            console.log('Register events and commands..')
            await this.__registerCommands(path.join(__dirname, '../..', 'commands'))
            await this.__registerEvents(path.join(__dirname, '../..', 'events'))
            await this.__registerFeatures(path.join(__dirname, '../..', 'features'))
        } catch(e) {
            console.log(e)
            process.exit(1)
        }

         try {
            await this.__loadCommands('1068820644277518376')
         } catch(e) {

         }
    }

    private async __registerCommands(commandsPath: string) {
        const dir = await fs.readdir(commandsPath)
        for (const file of dir) {
            const stat = await fs.lstat(path.join(commandsPath, file))
            if(stat.isDirectory()) {
                await this.__registerCommands(path.join(commandsPath, file))
            } else {
                if(!file.endsWith(".js")) return;
                let module: ICommand
                try {
                     module = new((await import(path.join(commandsPath, file))).default) as ICommand
                } catch(e) {
                    console.log('Failed to load command ' + path.join(commandsPath, file))
                    continue;
                }
                if(module.features) {
                    for (const feature of module.features) {
                        this.features.set(feature.name, feature)
                    }
                }
                this.commands.set(module.name, module)
            }
        }
    }

    private async __registerEvents(eventsPath: string) {
        const dir = await fs.readdir(eventsPath)
        for (const file of dir) {
            const stat = await fs.lstat(path.join(eventsPath, file))
            if(stat.isDirectory()) {
                await this.__registerEvents(path.join(eventsPath, file))
            } else {
                if(!file.endsWith(".js")) return;
                const module = new((await import(path.join(eventsPath, file))).default) as IEvent

                this.on(module.name, (...args) => module.run(this, ...args))
            }
        }
    }
    
    private async __registerFeatures(featuresPath: string) {
        const dir = await fs.readdir(featuresPath)
        for (const file of dir) {
            const stat = await fs.lstat(path.join(featuresPath, file))
            if(stat.isDirectory()) {
                await this.__registerFeatures(path.join(featuresPath, file))
            } else {
                if(!file.endsWith(".js")) return;
                const module = new((await import(path.join(featuresPath, file))).default) as IFeature<unknown>
                this.features.set(module.name, module)
            }
        }
    }

    private async __loadCommands(guildId: string) {
        const guild = await this.guilds.fetch(guildId);
        await guild.commands.set(this.__convertCommands())
    }

    private __convertCommands(): ApplicationCommandDataResolvable[] {
        const commands: ApplicationCommandDataResolvable[] = [];

        for (const command of this.commands.values()) {
            commands.push({ name: command.name, description: command.description, options: command.options || [] })
        }
        return commands
    }
}

export { BotClient }
