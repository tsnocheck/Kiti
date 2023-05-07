import { ApplicationCommandOption, PermissionsString } from 'discord.js';

type CommandRun = (ctx: any, ...args: any) => Promise<any> | void;

export interface CommandOptions {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  permissions?: PermissionsString[];
  development: boolean;
}

export abstract class Command {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  permissions: PermissionsString[];
  development: boolean;
  execute: CommandRun;

  constructor(
    { name, description, options, permissions, development }: CommandOptions,
    execute: CommandRun,
  ) {
    this.name = name;
    this.description = description;
    this.options = options ?? [];
    this.permissions = permissions ?? [];
    this.development = development ?? true;
    this.execute = execute;
  }
}
