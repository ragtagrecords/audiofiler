const fs = require('fs');
import { logError, logSuccess } from './logger';

// Files that are accessible via API live here
const rootDir = '/public-ext4/main';

export async function hasAccess(path: string, mode: any) {
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

export function addFile(file: any, dir: string) {
  return new Promise(resolve => {
    const dirPath = rootDir + dir + '/';
    const fileName = file.name;
    const fileSizeMB = file.size / 1e6;

    file.mv(`${dirPath}${fileName}`, (err: any) => {
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
