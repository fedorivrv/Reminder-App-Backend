import { Note } from "../models/note.js";
import { Subscription } from "../models/subscription.js";
import { sendPush } from "../utils/pushService.js";

export const sendDueReminders = async () => {
  const now = new Date();

  const reminders = await Note.find({
    "reminder.enabled": true,
    "reminder.dateTime": { $lte: now },
  });

  for (const note of reminders) {
    const subs = await Subscription.find({ userId: note.userId });

    for (const sub of subs) {
      await sendPush(sub, {
        title: "Нагадування",
        body: note.title,
        url: "/notes/" + note._id
      });
    }

    // Handling repeat
    if (note.reminder.repeatEveryDays) {
      const next = new Date(note.reminder.dateTime);
      next.setDate(next.getDate() + note.reminder.repeatEveryDays);
      note.reminder.dateTime = next;
    } else {
      note.reminder.enabled = false;
    }

    note.reminder.lastTriggered = now;
    await note.save();
  }
};
