import { model, Schema } from 'mongoose';
import { Menu } from '@/interfaces/menus.interface';
// 菜单 Schema
const MenuSchema = new Schema<Menu>({
  name: { type: String, required: true }, // 菜单名称，必填
  ingredients: [
    {
      name: { type: String, required: true }, // 配菜名称，必填
      amount: { type: String, required: true }, // 配菜数量，必填
    },
  ],
  servings: { type: Number, required: true }, // 几人份，必填
  preparation: { type: String, required: true }, // 配菜加工，必填
  notes: { type: String }, // 注意事项，选填
  steps: [
    {
      description: { type: String, required: true }, // 步骤描述，必填
      duration: { type: Number, required: true }, // 持续时间，以分钟为单位，必填
      actions: { type: [String], required: true }, // 操作列表，必填
    },
  ],
  image: { type: String, required: true }, // 做成后的图片，必填
  reviews: [
    {
      reviewer: { type: String, required: true }, // 评价人，必填
      rating: { type: Number, required: true }, // 评分，必填
      comment: { type: String, required: true }, // 评论内容，必填
    },
  ],
  improvements: { type: [String], required: true }, // 后续改进的部分，必填
});

// 导出菜单模型
export const MenuModel = model<Menu>('Menu', MenuSchema);
