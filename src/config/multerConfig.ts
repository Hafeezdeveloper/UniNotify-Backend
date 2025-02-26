// file-upload.config.ts

import * as path from 'path';
import { randomInt } from 'crypto';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { COVER_PREFIX, PROFILE_PREFIX } from 'src/libaray/constants/app.constants';
import * as dotenv from 'dotenv';
dotenv.config();
interface FileUploadConfigOptions {
  prefix: string;
  name?: string;
  fileSizeLimit?: number;
  maxFiles?: number;
}


const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  },
  region: process.env.AWS_REGION || "us-east-1"
});


export function createFileUploadConfig(options: FileUploadConfigOptions) {
  const {
    prefix,
    name,
    fileSizeLimit = 1024 * 1024 * 5,
    maxFiles = 16,
  } = options;

  return {
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME || "",
      key: (
        req: any,
        file: Express.Multer.File,
        cb: (error: Error | null, key: string) => void,
      ) => {
        // Check if user exists, otherwise generate a random ID
        const fileName =
          prefix === PROFILE_PREFIX || prefix === COVER_PREFIX
            ? req?.user?.userId || `guest-${randomInt(1000, 9999)}-${Date.now()}`
            : `${randomInt(1000, 10000)}-${Date.now()}`;

        cb(null, `${prefix}-${fileName}${path.extname(file.originalname)}`);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      contentDisposition: (req, file, cb) => {
        const disposition = `inline; filename="${file.originalname}"`;
        cb(null, disposition);
      },
    }),
    limits: {
      fileSize: fileSizeLimit,
      files: maxFiles,
    },
  };

}
