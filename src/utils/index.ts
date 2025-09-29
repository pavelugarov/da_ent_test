
export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getExtension(filename: string) {
  return filename.substring(filename.lastIndexOf('.') + 1);
}

export function getUniqFilename(filename: string) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  return `file-${uniqueSuffix}${filename.substring(filename.lastIndexOf('.'))}`;
}




