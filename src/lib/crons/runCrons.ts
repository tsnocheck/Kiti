import clearViewedCron from "./clearViewed";
import {UserUsecase} from "../usecases/UserUsecase";
import clearLikesCron from "./clearLikes";

export default function runCrons(userUsecase: UserUsecase) {
  clearViewedCron(userUsecase).start();
  clearLikesCron(userUsecase).start();
}
