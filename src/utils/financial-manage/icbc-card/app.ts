import fs from 'fs';
import pdf from 'pdf-parse';
import { BillBase } from '@/interfaces/bills.interface';

/**
 * 信用卡账单解析器类
 * 用于解析PDF格式的信用卡账单，提取交易记录
 */
export class CreditCardStatementParser {
  private pdfPath: string;
  private transactions: BillBase[];

  constructor(pdfPath: string) {
    this.pdfPath = pdfPath;
    this.transactions = [];
  }

  async parse(): Promise<BillBase[]> {
    try {
      const dataBuffer = fs.readFileSync(this.pdfPath);
      const data = await pdf(dataBuffer);

      const content = data.text.replace(/\n+/g, ' ');
      const pages = content.split('交易场所');
      pages.shift();
      console.log(`找到 ${pages.length} 页数据`);

      pages.forEach(page => {
        const transactionSection = page.split('本页支出算术合计')[0];
        if (!transactionSection) return;

        const transactions = this.extractTransactions(transactionSection);
        const pageTransactions = this.parseTransactions(transactions);
        this.transactions.push(...pageTransactions);
      });

      console.log(`\n总共解析到 ${this.transactions.length} 条交易记录`);
      return this.transactions;
    } catch (error) {
      console.error('解析PDF失败:', error);
      throw error;
    }
  }

  private extractTransactions(section: string): string[] {
    const transactions = section.split(/(?=\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);
    return transactions.map(t => t.trim()).filter(t => this.isTransactionLine(t));
  }

  private parseTransactions(transactions: string[]): BillBase[] {
    return transactions.map(line => this.parseLine(line)).filter((t): t is BillBase => t !== null);
  }

  private isTransactionLine(line: string): boolean {
    return /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}.*?(借|贷)\s+(人民币|美元)/.test(line);
  }

  private parseLine(line: string): BillBase | null {
    try {
      const regex = /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}):\d{2}.*?(借|贷)\s+(人民币|美元)\s+([\d,\.]+).*?(?:消费|退货|转帐)\s+(.+?)$/;
      const match = line.match(regex);

      if (!match) return null;

      const [_, date, time, type, currency, amount, merchant] = match;
      const parsedAmount = parseFloat(amount.replace(/,/g, '')); // 已经是正数

      return {
        date: `${date} ${time}`,
        merchant: merchant.trim(),
        description: `信用卡${type === '借' ? '支出' : '收入'}`,
        amount: parsedAmount,
        type: type === '借' ? '支出' : '收入',
        category: '信用卡',
        platform: 'unknown',
        currency: currency === '人民币' ? 'CNY' : 'USD',
        remark: time,
        tag: '信用卡',
      };
    } catch (error) {
      return null;
    }
  }

  async exportToCSV(outputPath: string): Promise<void> {
    const header = '交易日期,商户,描述,金额,类型,分类,平台,币种,备注,标签\n';
    const csvContent = this.transactions
      .map(t => `${t.date},${t.merchant},${t.description},${t.amount},${t.type},${t.category},${t.platform},${t.currency},${t.remark},${t.tag}`)
      .join('\n');

    await fs.promises.writeFile(outputPath, header + csvContent);
  }
}
