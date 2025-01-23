import { Document, Schema } from 'mongoose';

// 账单的接口
export interface BillBase {
  date: string; // 交易日期
  merchant: string; // 商户名称
  description: string; // 交易描述
  amount: number; // 交易金额
  type: '支出' | '收入'; // 交易类型
  category: string; // 交易分类
  platform: 'alipay' | 'wechat' | 'jd' | 'unknown'; // 交易平台
  currency: 'CNY' | 'USD'; // 币种
  remark?: string;
  tag?: string;
  isDeleted?: boolean; // 添加伪删除字段
}

export type Bill = Document & BillBase & { userID: Schema.Types.ObjectId };

export interface CategoryStatistics {
  amount: number;
  count: number;
}

export interface DailyStatistics {
  date: string;
  totalExpense: number;
  totalIncome: number;
  netAmount: number;
  transactionCount: number;
  categories: {
    [key: string]: CategoryStatistics;
  };
}

export interface MonthlyStatistics {
  month: string; // YYYY-MM
  totalExpense: number;
  totalIncome: number;
  netAmount: number;
  transactionCount: number;
  dailyAverage: number;
  categories: {
    [key: string]: CategoryStatistics;
  };
}

export interface UploadResult {
  success: number;
  failed: number;
  errors: any[];
  insertedCount: number;
  updatedCount: number;
}

// 分页
export interface Pagination {
  bills: Bill[];
  total: number;
}
