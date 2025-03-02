import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';
import { EnvVars } from '../constants/index.js';


export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
    
  );

  const photoUrl = `/uploads/${file.filename}`;  
  return `${getEnvVar(EnvVars.APP_DOMAIN)}${photoUrl}`;
};
