// Ensures index is valid for the current # of songs
export const validIndex = (index: number, arrayLength: number) => {
  if (!index || !arrayLength || arrayLength === 1) {
    return 0;
  }
  const remainder = Math.abs(index % arrayLength);
  return index >= 0 ? remainder : arrayLength - remainder;
};
