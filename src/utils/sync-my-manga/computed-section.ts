import { MangaService } from '@/services/mangas.service';
import { Container } from 'typedi';

export type MissingRanks = [offset: number, limit: number][];
const manga = Container.get(MangaService);
// 接口limit最大值
const LIMIT_MAX = 100;
export async function getMissingRanks(scope: number): Promise<MissingRanks> {
  const missRanks: number[] = await manga.findMissingManga(scope);
  return countConsecutiveNumbers(missRanks);
}

/**
 * 统计数组中连续自然数的段落，如果超过最大限制，则截断处理
 * @param {number[]} arr - 输入的自然数数组
 * @returns {[number, number][]} - 包含起始数字和连续数量的数组
 */

function countConsecutiveNumbers(arr: number[]): MissingRanks {
  arr.sort((a, b) => a - b); // 对数组进行排序
  const result = [];
  let start = arr[0];
  let count = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1] + 1) {
      count++;
      if (count > LIMIT_MAX) {
        // 如果超过100个连续自然数，就截断为多个小段
        result.push([start, LIMIT_MAX]);
        start = arr[i];
        count = 1;
      }
    } else {
      result.push([start, count]);
      start = arr[i];
      count = 1;
    }
  }
  // 处理最后一段连续自然数
  if (count > LIMIT_MAX) {
    result.push([start, LIMIT_MAX]);
  } else {
    result.push([start, count]);
  }
  return result;
}
