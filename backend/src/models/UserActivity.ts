import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  videoId: { type: String, required: true },
  category: { type: String, required: true },
  watchTime: { type: Number, required: true }, // in sec
  isBlockedTopic: { type: Boolean, required: true },
  wasOverride: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now, index: true }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);
export default UserActivity;