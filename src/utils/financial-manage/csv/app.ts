import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import iconv from 'iconv-lite';

// 添加日志级别常量
enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

interface ErrorInfo {
  phase: string;
  message: string;
  stack?: string;
  context?: any;
  timestamp: string;
}

// 定义平台类型
type Platform = 'alipay' | 'wechat' | 'jd' | null;

// 定义字段映射接口
interface FieldMapping {
  date: string;
  merchant: string;
  description: string;
  amount: string;
  type: string;
  status: string;
  orderNo: string;
  paymentMethod: string;
}

// 在文件开头添加类型定义
interface TransactionRecord {
  date: string;
  merchant: string;
  description: string;
  amount: number;
  type: '支出' | '收入';
  category: string;
  platform: 'unknown' | 'alipay' | 'wechat' | 'jd';
  currency: 'CNY' | 'USD';
  remark: string;
  tag: string;
}

interface ExportData {
  metadata: {
    platform: Platform;
    exportTime: string;
    fileName: string;
    totalRecords: number;
  };
  transactions: TransactionRecord[];
}

/**
 * 格式化日期时间
 */
function formatDateTime(dateStr: string): string {
  try {
    let date: Date;

    if (dateStr.includes('/')) {
      const [datePart, timePart] = dateStr.split(' ');
      const [year, month, day] = datePart.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), ...(timePart ? timePart.split(':').map(Number) : [0, 0]));
    } else if (dateStr.includes('-')) {
      date = new Date(dateStr.replace(/\t/g, ''));
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('日期格式化失败:', dateStr, error);
    return dateStr;
  }
}

/**
 * 通用账单解析器类
 */
export class BillParser {
  private csvPath: string;
  private transactions: TransactionRecord[];
  private platform: Platform;
  private logLevel: LogLevel;
  private errors: ErrorInfo[];

  constructor(csvPath: string) {
    this.csvPath = csvPath;
    this.transactions = [];
    this.platform = null;
    this.logLevel = LogLevel.INFO;
    this.errors = [];
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (level >= this.logLevel) {
      const timestamp = new Date().toISOString();
      const levelStr = LogLevel[level];
      const prefix = `[${timestamp}] ${levelStr}:`;

      console.log(prefix, message);
      if (data) {
        console.log('  ', typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
      }
    }
  }

  private recordError(phase: string, error: Error, context?: any): void {
    const errorInfo: ErrorInfo = {
      phase,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };
    this.errors.push(errorInfo);
    this.log(LogLevel.ERROR, `Error in ${phase}:`, errorInfo);
  }

  /**
   * 识别账单平台类型
   */
  detectPlatform(headers: string[]): Platform {
    console.log('\n=== 平台识别 ===');
    console.log('文件名:', path.basename(this.csvPath));
    console.log('检查文件头部内容:');
    headers.forEach((line, index) => {
      if (line) console.log(`[${index}] ${line}`);
    });

    const headerStr = headers.join(' ');

    const features = {
      alipay: ['支付宝', '交易对方', '商品说明', '支付宝账单明细'],
      wechat: ['微信支付账单明细', '微信昵称', '微信支付'],
      jd: ['京东账号', '京东支付', '商户名称', '京东账单'],
    };

    for (const [platform, keywords] of Object.entries(features)) {
      if (keywords.some(keyword => headerStr.includes(keyword))) {
        return platform as Platform;
      }
    }

    throw new Error('未识别的账单格式');
  }

  private getFieldMapping(): FieldMapping | null {
    const mappings: Record<string, FieldMapping> = {
      alipay: {
        date: '交易时间',
        merchant: '交易对方',
        description: '商品说明',
        amount: '金额',
        type: '收/支',
        status: '交易状态',
        orderNo: '交易订单号',
        paymentMethod: '收/付款方式',
      },
      wechat: {
        date: '交易时间',
        merchant: '交易对方',
        description: '商品',
        amount: '金额(元)',
        type: '收/支',
        status: '当前状态',
        orderNo: '交易单号',
        paymentMethod: '支付方式',
      },
      jd: {
        date: '交易时间',
        merchant: '商户名称',
        description: '交易说明',
        amount: '金额',
        type: '收/支',
        status: '交易状态',
        orderNo: '交易订单号',
        paymentMethod: '收/付款方式',
      },
    };
    return this.platform ? mappings[this.platform] : null;
  }

  /**
   * 获取交易分类字段名
   */
  private getCategoryField(): string {
    const categoryFields: Record<string, string> = {
      alipay: '交易分类',
      wechat: '交易类型',
      jd: '交易分类',
    };
    return categoryFields[this.platform];
  }

  /**
   * 获取错误报告
   */
  getErrorReport() {
    return {
      totalErrors: this.errors.length,
      errorsByPhase: this.errors.reduce((acc: Record<string, number>, err) => {
        acc[err.phase] = (acc[err.phase] || 0) + 1;
        return acc;
      }, {}),
      errors: this.errors,
    };
  }

  async parse(): Promise<TransactionRecord[]> {
    try {
      this.log(LogLevel.INFO, `开始解析文件: ${this.csvPath}`);

      let buffer: Buffer;
      try {
        buffer = fs.readFileSync(this.csvPath);
        this.log(LogLevel.DEBUG, '文件读取成功', { size: buffer.length });
      } catch (error) {
        this.recordError('file_read', error as Error, { path: this.csvPath });
        throw new Error(`文件读取失败: ${(error as Error).message}`);
      }

      // 预检测平台类型和编码
      let content: string;
      try {
        const gbkContent = iconv.decode(buffer, 'gbk');
        const utf8Content = buffer.toString('utf8');

        if (gbkContent.includes('支付宝') || gbkContent.includes('交易对方')) {
          this.platform = 'alipay';
          content = gbkContent;
        } else if (utf8Content.includes('微信支付') || utf8Content.includes('微信昵称')) {
          this.platform = 'wechat';
          content = utf8Content;
        } else if (utf8Content.includes('京东账号') || utf8Content.includes('京东支付')) {
          this.platform = 'jd';
          content = utf8Content;
        } else if (gbkContent.includes('京东账号') || gbkContent.includes('京东支付')) {
          this.platform = 'jd';
          content = gbkContent;
        }

        if (!this.platform) {
          throw new Error('无法识别账单平台类型');
        }

        this.log(LogLevel.INFO, `识别到平台: ${this.platform}`);
      } catch (error) {
        this.recordError('platform_detect', error as Error);
        throw new Error(`平台检测失败: ${(error as Error).message}`);
      }

      // 预处理内容，移除 BOM 和空行
      content = content.replace(/^\uFEFF/, '').trim();

      // 找到实际的表头行
      const lines = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // 找到实际的表头行
      const mapping = this.getFieldMapping();
      let headerLineIndex = -1;

      // 查找包含所需字段的表头行
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const fields = Object.values(mapping);
        const matchCount = fields.filter(field => line.includes(field)).length;

        this.log(LogLevel.DEBUG, `检查第 ${i} 行是否为表头`, {
          line,
          matchCount,
          requiredFields: fields,
        });

        if (matchCount >= 3) {
          // 至少匹配3个字段才认为是表头
          headerLineIndex = i;
          this.log(LogLevel.INFO, `找到表头行: 第 ${i} 行`);
          break;
        }
      }

      if (headerLineIndex === -1) {
        throw new Error('未找到表头行');
      }

      // 只取表头行及之后的内容进行解析
      const dataContent = lines.slice(headerLineIndex).join('\n');

      return new Promise((resolve, reject) => {
        const parser = parse({
          delimiter: ',',
          columns: true,
          skip_empty_lines: true,
          trim: true,
          skip_records_with_empty_values: true,
          relax_column_count: true,
          relax_quotes: true,
        });

        const records: TransactionRecord[] = [];
        let parseErrors = 0;

        parser.on('readable', () => {
          let record;
          while ((record = parser.read()) !== null) {
            try {
              const transaction = this.parseRecord(record);
              if (transaction) {
                records.push(transaction);
              }
            } catch (error) {
              parseErrors++;
              this.recordError('record_parse', error as Error, { record });

              if (parseErrors > 100) {
                parser.end();
                reject(new Error('解析错误次数过多，终止处理'));
                return;
              }
            }
          }
        });

        parser.on('error', error => {
          this.recordError('csv_parse', error);
          reject(error);
        });

        parser.on('end', () => {
          this.log(LogLevel.INFO, '解析完成', {
            totalRecords: records.length,
            errorCount: parseErrors,
          });

          this.transactions = records;
          resolve(records);
        });

        parser.write(dataContent);
        parser.end();
      });
    } catch (error) {
      this.recordError('parse', error as Error);
      throw error;
    }
  }

  /**
   * 导出数据为JSON文件
   */
  async exportToJSON(outputPath?: string): Promise<string> {
    try {
      const exportData: ExportData = {
        metadata: {
          platform: this.platform,
          exportTime: new Date().toISOString(),
          fileName: path.basename(this.csvPath),
          totalRecords: this.transactions.length,
        },
        transactions: this.transactions,
      };

      const actualOutputPath =
        outputPath || path.join(path.dirname(this.csvPath), `${this.platform}_${path.basename(this.csvPath, '.csv')}_${Date.now()}.json`);

      await fs.promises.writeFile(actualOutputPath, JSON.stringify(exportData, null, 2), 'utf8');

      this.log(LogLevel.INFO, `JSON导出成功: ${actualOutputPath}`);
      return actualOutputPath;
    } catch (error) {
      this.recordError('json_export', error as Error);
      throw new Error(`JSON导出失败: ${(error as Error).message}`);
    }
  }

  /**
   * 标准化交易类型
   */
  private normalizeTransactionType(type: string): '收入' | '支出' {
    // 支出相关的关键词
    const expenseKeywords = ['支出', '消费', '转出', '借', '还款'];
    // 收入相关的关键词
    const incomeKeywords = ['收入', '转入', '退款', '贷', '不计收支'];

    if (expenseKeywords.some(keyword => type.includes(keyword))) {
      return '支出';
    } else if (incomeKeywords.some(keyword => type.includes(keyword))) {
      return '收入';
    }

    return '支出';
  }

  /**
   * 解析单条记录
   */
  private parseRecord(record: any): TransactionRecord | null {
    try {
      const mapping = this.getFieldMapping();

      // 添加调试信息
      this.log(LogLevel.DEBUG, '解析记录:', {
        record,
        mapping,
        platform: this.platform,
      });

      // 跳过空记录
      if (!record || !Object.keys(record).length) {
        this.log(LogLevel.DEBUG, '跳过空记录');
        return null;
      }

      // 检查字段映射是否存在
      if (!mapping) {
        this.log(LogLevel.ERROR, '未找到字段映射', { platform: this.platform });
        return null;
      }

      // 处理金额字段时增加容错处理
      let amount = 0;
      const amountField = mapping.amount;

      // 尝试多个可能的金额字段名
      const possibleAmountFields = ['金额', '金额（元）', '金额(元)'];
      let amountStr = '';

      for (const field of possibleAmountFields) {
        if (record[field] !== undefined && record[field] !== '') {
          amountStr = record[field].toString();
          break;
        }
      }

      if (!amountStr) {
        this.log(LogLevel.WARN, '未找到金额字段', {
          expectedFields: possibleAmountFields,
          availableFields: Object.keys(record),
        });
        return null;
      }

      // 微信支付特殊处理
      if (this.platform === 'wechat') {
        // 移除金额前的 ¥ 符号和多余的空格
        amountStr = amountStr.replace(/^¥\s*/, '').trim();
      }

      // 清理金额字符串
      amountStr = amountStr
        .replace(/[¥￥]/g, '') // 移除货币符号
        .replace(/,/g, '') // 移除千位分隔符
        .replace(/\s+/g, '') // 移除空格
        .replace(/[()（）]/g, '') // 移除中英文括号
        .replace(/\t/g, ''); // 移除制表符

      // 尝试解析金额
      amount = parseFloat(amountStr) || 0;

      // 提取交易分类信息
      const categoryField = this.getCategoryField();
      const category = record[categoryField]?.trim() || '其他';

      // 构建交易记录
      const type = this.normalizeTransactionType(record[mapping.type]?.trim() || '');
      const transaction: TransactionRecord = {
        date: formatDateTime(record[mapping.date]?.trim() || ''),
        merchant: (record[mapping.merchant] || '').trim(),
        description: (record[mapping.description] || '').trim(),
        amount: Math.abs(amount),
        type,
        category: category,
        platform: this.platform as 'alipay' | 'wechat' | 'jd',
        currency: 'CNY',
        remark: '',
        tag: '',
      };

      this.log(LogLevel.DEBUG, '解析结果:', transaction);
      return transaction;
    } catch (error) {
      this.recordError('record_parse', error as Error, {
        record,
        platform: this.platform,
        mapping: this.getFieldMapping(),
      });
      return null;
    }
  }
}

/**
 * 扫描目录下的所有CSV文件
 */
function scanCsvFiles(dirPath: string): string[] {
  try {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => file.toLowerCase().endsWith('.csv')).map(file => path.join(dirPath, file));
  } catch (error) {
    console.error('扫描目录失败:', error);
    return [];
  }
}

/**
 * 主函数
 */
async function main() {
  const currentDir = __dirname;
  const csvFiles = scanCsvFiles(currentDir);

  console.log(`\n=== 开始处理 ===`);
  console.log(`找到 ${csvFiles.length} 个CSV文件:`);

  const results = {
    success: 0,
    failed: 0,
    errors: [],
    exports: [] as string[],
  };

  for (const file of csvFiles) {
    console.log(`\n处理文件: ${path.basename(file)}`);
    const parser = new BillParser(file);

    try {
      const transactions = await parser.parse();
      results.success++;

      const jsonPath = await parser.exportToJSON();
      results.exports.push(jsonPath);

      console.log('\n=== 解析结果 ===');
      console.log(`总记录数: ${transactions.length} 条`);

      if (transactions.length > 0) {
        console.log('\n第一条记录示例:');
        console.log(transactions[0]);
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        file: path.basename(file),
        error: (error as Error).message,
        details: parser.getErrorReport(),
      });
    }
  }

  // 输出处理结果
  console.log('\n=== 处理总结 ===');
  console.log(`成功: ${results.success} 个文件`);
  console.log(`失败: ${results.failed} 个文件`);

  if (results.exports.length > 0) {
    console.log('\n=== 导出文件 ===');
    results.exports.forEach(path => {
      console.log(`- ${path}`);
    });
  }

  if (results.errors.length > 0) {
    console.log('\n=== 错误详情 ===');
    results.errors.forEach(err => {
      console.log(`\n文件: ${err.file}`);
      console.log('错误信息:', err.error);
      console.log('详细报告:', err.details);
    });
  }
}

// 只在直接运行��执行 main 函数
if (require.main === module) {
  main().catch(error => {
    console.error('程序执行失败:', error);
    process.exit(1);
  });
}
