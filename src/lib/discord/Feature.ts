import {BotClient} from "./Client";

interface IFeature<T> {
  name: string;
  preconditions?: string[];
  run: RunFeature<T>;
}

type RunFeature<T> = ({interaction, client}: { interaction: T, client: BotClient }) => any;

export {IFeature};
