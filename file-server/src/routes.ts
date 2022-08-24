import { hasAccess, addFile } from './services';
import fs from 'fs';
const rootDir = '/public-ext4/main';
import { logError, logSuccess } from './logger';

export const getFileRoute = async (req: any, res: any): Promise<boolean> => {
  const { dir, fileName } = req.params;

  if (!dir || !fileName) {
    logError('getFile()', `Improper request: ${req.originalUrl}`);
    res.status(409).send("Directory and filename required");
  }

  const filePath = `${rootDir}/${dir}/${fileName}`;
  const isFileReadable = await hasAccess(filePath, fs.constants.R_OK);

  if (!isFileReadable) {
    logError('getFile()', `File not found: ${req.originalUrl}`);
    res.status(409).send("File not found");
    return false;
  }

  res.download(filePath, function (err: any) {
    if (err) {
        logError('getFile()', err);
        return false;
    } else {
        logSuccess('getFile()', 'Sent ' + filePath);
        return true;
    }
  });

  return false;
};

export const addFileRoute = async (req: any, res: any): Promise<boolean> => {

  if (!req) {
    res.status(400).send("Files not found in request");
  }
  const file = req.files.file;
  const directory = req.originalUrl;
  const result = await addFile(file, directory);

  if (result) {
    res.status(200).send("File uploaded");
    return true;
  } else {
    res.status(409).send("Failed to upload file");
    return false;
  }
};