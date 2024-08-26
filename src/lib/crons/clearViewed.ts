import {CronJob} from "cron";
import {UserUsecase} from "../usecases/UserUsecase";

export default function clearViewedCron(userCase: UserUsecase) {
  const cron = CronJob.from({
    cronTime: "0 */12 * * *",
    onTick: async () => {
      await userCase.clearViewed();
    },
    timeZone: 'Europe/Moscow',
    start: false
  });

  return cron;
}
