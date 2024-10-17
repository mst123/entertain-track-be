import { model, Schema } from 'mongoose';
import { User } from '@interfaces/users.interface';
import crypto from 'crypto';
// 用户 Schema

const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
  email: { type: String, required: true, unique: true },
  registrationDate: { type: Date, default: Date.now() },
  userPermission: { type: String, enum: ['admin', 'user'], default: 'user' },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Number,
  active: {
    // 伪删除
    type: Boolean,
    default: true,
    select: false,
  },
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// 签发token后是否修改了密码
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000 + '', 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// 生成重置密码的随机token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // 10分钟后过期
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const UserModel = model<User>('User', UserSchema);
