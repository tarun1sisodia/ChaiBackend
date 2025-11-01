import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    id: {},
    subscriber: {
      type: Schema.Types.ObjectId, // the who is subscriping
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscriping
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
