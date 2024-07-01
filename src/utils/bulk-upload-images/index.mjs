import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

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

  imageFiles.forEach(file => {
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
      })
      .catch(error => {
        console.error(`Error uploading ${file}:`, error.message);
      });
  });
});
