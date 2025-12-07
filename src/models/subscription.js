import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  endpoint: String,
  expirationTime: Number,
  keys: {
    p256dh: String,
    auth: String
  }
});

export const Subscription = model("Subscription", subscriptionSchema);
