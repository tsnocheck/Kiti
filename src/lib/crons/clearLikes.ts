import {CronJob} from "cron";
import {UserUsecase} from "../usecases/UserUsecase";

export default function clearLikesCron(userCase: UserUsecase) {
  const cron = CronJob.from({
    cronTime: "0 */12 * * *",
    onTick: async () => {
      await userCase.cleanLikes();
      await userCase.cleanMessages();
    },
    timeZone: 'Europe/Moscow',
    start: false
  });

  return cron;
}
