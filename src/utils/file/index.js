import { existsSync, rm } from 'fs';

export const deleteUploads = () => {
  if (existsSync('./uploads')) {
    rm('./uploads', { recursive: true }, err => {
      if (err) console.error(err);
    });
  }
};
