import { BotClient } from './BotClient';

// TODO: дописать систему фич
export abstract class Feature {
  name: string;
  isEvent: boolean;
  execute: FeatureRun;
  constructor({ name, isEvent }: FeatureOptions, execute: FeatureRun) {
    this.name = name;
    this.isEvent = isEvent ?? false;
    this.execute = execute;
  }
}

export interface FeatureOptions {
  name: string;
  isEvent: boolean;
}

type FeatureRun = (
  ctx: any,
  client: BotClient,
  ...args: any
) => Promise<any> | void;
