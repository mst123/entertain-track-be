import { Document } from 'mongoose';

// 配菜的接口
interface Ingredient {
  name: string; // 配菜名称
  amount: string; // 配菜数量
}

// 步骤的接口
interface Step {
  description: string; // 步骤描述
  duration: number; // 持续时间，以分钟为单位
  actions: string[]; // 操作列表
}

// 评价的接口
interface Review {
  reviewer: string; // 评价人
  rating: number; // 评分
  comment: string; // 评论内容
}

// 菜单的接口
interface MenuBase {
  name: string; // 菜单名称
  ingredients: Ingredient[]; // 配菜列表
  servings: number; // 几人份
  preparation: string; // 配菜加工
  notes: string; // 注意事项
  steps: Step[]; // 步骤，时间轴体现，同一个可以有多个操作
  image: string; // 做成后的图片
  reviews?: Review[]; // 评价列表
  improvements?: string; // 后续改进的部分
}

export type Menu = Document & MenuBase;
