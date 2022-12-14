const fs = require('fs');
import { logError, logSuccess } from './logger';

// Files that are accessible via API live here
const rootDir = process.env.ROOT_DIR;

export async function hasAccess(path: string, mode: any) {
  console.log(path);
  fs.access(
    path,
    mode,
    (err: any) => {
      if (err) {
        logError('hasAccess()', err.message);
        return false;
      }  
  });
  return true;
}

export function addFile(file: any, folder: string) {
  return new Promise(resolve => {
    const dirPath = `${rootDir}/${folder}`;
    const fileName = file.name;
    const fileSizeMB = file.size / 1e6;

    file.mv(`${dirPath}/${fileName}`, (err: any) => {
      if (err) {
        logError('addFile()', err.message);
        resolve(false);
      } else {
        logSuccess('addFile()', 'Received ' + fileName + " (" + fileSizeMB + " MB)");
        resolve(true);
      }
    });
  });
}
