import axios from 'axios';
import w from 'file';
import { readFile } from 'node:fs';

readFile('./animeRecord.js', (err, data) => {
  if (err) throw err;
  console.log(data);
});
