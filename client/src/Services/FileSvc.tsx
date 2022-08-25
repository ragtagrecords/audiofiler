import axios from 'axios';
import { fileServerURL } from 'env';

export const downloadFile = (folder: string, actualFileName: string, desiredFileName: string) => {
  axios({
    url: `${fileServerURL()}/${folder}/${actualFileName}`,
    method: 'GET',
    responseType: 'blob', // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', desiredFileName);
    document.body.appendChild(link);
    link.click();
  });
};

export const uploadFile = async (file: File, dir: string) => {
  if (!file || !dir) {
    return false;
  }
  const url = `${fileServerURL()}${dir}`;
  const formData = new FormData();
  formData.append('file', file);
  try {
    await axios.post(
      url,
      formData,
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getExtension = (fileName: string): string => {
  return fileName.split('.').pop() ?? 'undefined';
};

export const removeExtraExtensions = (fileName: string): string => {
  const splitFileName = fileName.split('.');
  return splitFileName[0] ?? 'New Name Here';
};
