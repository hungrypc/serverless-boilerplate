export const sanitizeFileName = (str: string) => str.replace(/[^a-zA-Z0-9-_+.]+/g, '')
