import { ApplicationCommandOption, PermissionsString } from 'discord.js';

export type Permission = '' | PermissionsString;

type CommandRun = (ctx: any, ...args: any) => Promise<any> | void;

export interface CommandOptions {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  execute: CommandRun;
}

export abstract class Command {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  execute: CommandRun;

  constructor({ name, description, execute, options }: CommandOptions) {
    this.name = name;
    this.description = description;
    this.options = options ?? [];
    this.execute = execute;
  }
}
