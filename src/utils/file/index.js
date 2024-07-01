import fetch from 'node-fetch';
import { existsSync, rm } from 'fs';
export const getTinyUrl = async (apiToken = process.env.ACCESS_TOKEN, url) => {
  const data = await fetch('https://api.tinyurl.com/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
    }),
  });

  const json = await data.json();
  return json.data.tiny_url;
};

export const deleteUploads = () => {
  if (existsSync('./uploads')) {
    rm('./uploads', { recursive: true }, err => {
      if (err) console.error(err);
    });
  }
};
