import mongoose from 'mongoose';

const userDailyMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  date: { type: Date, required: true },
  totalTime: { type: Number, required: true },         // seconds
  blockedTime: { type: Number, required: true },       // seconds
  overrideCount: { type: Number, required: true },
  distractionScore: { type: Number, required: true }   // 0-1 scale
});

userDailyMetricsSchema.index({ userId: 1, date: 1 }, { unique: true });

const UserDailyMetrics = mongoose.model('UserDailyMetrics', userDailyMetricsSchema);
export default UserDailyMetrics;