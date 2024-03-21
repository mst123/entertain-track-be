import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

export async function getRecord(type: 'animeOffset' | 'mangaOffset') {
  try {
    const record: string = (await readFile(resolve(__dirname, `../local-storage/record.json`), 'utf-8')).toString();
    return JSON.parse(record)[type] as number;
  } catch (error) {
    console.log(error);
  }
}

export async function setRecord(type: 'animeOffset' | 'mangaOffset', value: number) {
  try {
    const record = JSON.parse(await readFile(resolve(__dirname, `./local-storage/record.txt`), 'utf-8').toString());
    record[type] = value;
    await writeFile(resolve(__dirname, `./local-storage/record.txt`), JSON.stringify(record));
  } catch (error) {
    console.log(error);
  }
}
