import { model, Schema } from 'mongoose';
import { Bill } from '@/interfaces/bills.interface';

const billSchema = new Schema<Bill>(
  {
    date: { type: String, required: [true, '交易日期不能为空'] },
    // 交易对象
    merchant: { type: String, required: [true, '交易对象不能为空'] },
    // 交易描述
    description: { type: String, required: [true, '交易描述不能为空'] },
    // 交易金额
    amount: { type: Number, required: [true, '交易金额不能为空'] },
    // 交易类型
    type: { type: String, enum: ['支出', '收入'], required: [true, '交易类型不能为空'] },
    // 交易分类
    category: { type: String, required: [true, '交易分类不能为空'] },
    // 交易平台 不提供则默认为unknown(即漏统计的)
    platform: { type: String, enum: ['alipay', 'wechat', 'jd', 'unknown'], default: 'unknown' },
    // 币种
    currency: { type: String, enum: ['CNY', 'USD'], default: 'CNY' },
    // 备注
    remark: { type: String },
    // 标签
    tag: { type: String },
    // 添加伪删除字段
    isDeleted: { type: Boolean, default: false, select: false },
    // 关联用户表
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const BillModel = model<Bill>('Bill', billSchema);
