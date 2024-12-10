import { User } from '@/interfaces/users.interface'; // 确保路径正确

declare global {
  namespace Express {
    interface Request {
      user?: User; // 根据实际的用户对象类型定义
    }
  }
}
