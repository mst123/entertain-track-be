import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

const agent = {
  protocol: 'http', // 或 'https' 取决于你的代理
  host: '127.0.0.1', // 代理服务器的地址
  port: 7890, // 代理服务器的端口
};
// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 ./images 目录下的所有文件
const imagesDirectory = path.join(__dirname, 'images');

fs.readdir(imagesDirectory, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory:', err);
  }

  // 过滤出图片文件（假设图片文件是 .jpg, .jpeg, .png 格式）
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

  imageFiles.forEach((file, index) => {
    // 创建 FormData 实例
    const formData = new FormData();
    const filePath = path.join(imagesDirectory, file);

    // 附加文件并指定文件名
    formData.append('file', fs.createReadStream(filePath));

    // 上传图片
    axios
      .post('http://localhost:3000/api/v1/files', formData, {
        headers: {
          ...formData.getHeaders(),
          defParamCharset: 'utf-8',
        },
      })
      .then(response => {
        console.log(`Successfully uploaded ${file}:`, response.data);
        createBook(file.split('.')[0], response.data, index);
      })
      .catch(error => {
        console.error(`Error uploading ${file}:`, error.message);
      });
  });
});

async function createBook(fileName, response, index) {
  console.log(fileName, response.longurl);
  try {
    await new Promise(resolve => setTimeout(resolve, 10000 * index));
    const { data: res } = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      proxy: agent,
      headers: {
        'User-Agent': 'RapidAPI/4.2.5 (Macintosh; OS X/14.5.0) GCDHTTPRequest',
      },
      params: {
        q: fileName,
        key: 'AIzaSyAHKwFlONsjDe1dn4gNxoVcbaHUSqYqS1k',
      },
    });
    const bookInfo = res?.items?.[0]?.volumeInfo;
    console.log(res);
    await axios.post('http://localhost:3000/api/v1/books', {
      categories: bookInfo?.categories || ['未分类'],
      name: fileName,
      introduction: bookInfo?.description || '待补充',
      coverPhoto: response.longurl,
    });
  } catch (error) {
    console.log(error);
  }
}
