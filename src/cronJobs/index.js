import cron from "node-cron";
import { sendDueReminders } from "./sendReminders.js";

export const initCronJobs = () => {
  cron.schedule("* * * * *", sendDueReminders);
};
