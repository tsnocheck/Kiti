import {BotClient} from "./Client";

interface IFeature<T> {
    name: string;
    run: RunFeature<T>;
}
type RunFeature<T> = ({ interaction, client }: { interaction: T, client: BotClient }) => any;

export { IFeature };
