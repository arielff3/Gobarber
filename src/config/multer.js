import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // 1qwe12ewq.png exemplo de nome de entradas
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
