import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

export async function getRecord(type: 'mangaOffset' | 'mangaOffset') {
  try {
    const record: string = (await readFile(resolve(__dirname, `../local-storage/record.json`), 'utf-8')).toString();
    return JSON.parse(record)[type] as number;
  } catch (error) {
    console.log(error);
  }
}

export async function setRecord(type: 'mangaOffset' | 'mangaOffset', value: number) {
  try {
    const recordStr: string = (await readFile(resolve(__dirname, `../local-storage/record.json`), 'utf-8')).toString();
    const record = JSON.parse(recordStr);
    record[type] = value;
    await writeFile(resolve(__dirname, `../local-storage/record.json`), JSON.stringify(record));
  } catch (error) {
    console.log(error);
  }
}
