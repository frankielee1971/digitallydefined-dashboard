// src/lib/storage.js
// Puter.js filesystem storage module

import { getPuter } from './puter.js';

export async function writeFile(path, content) {
  try {
    const puter = await getPuter();
    await puter.fs.writeFile(path, content);
    return { success: true };
  } catch (error) {
    console.error('Failed to write file:', error);
    return { success: false, error };
  }
}

export async function readFile(path) {
  try {
    const puter = await getPuter();
    const content = await puter.fs.readFile(path);
    return { success: true, data: content };
  } catch (error) {
    console.error('Failed to read file:', error);
    return { success: false, error, data: null };
  }
}

export async function listFiles(path = '/') {
  try {
    const puter = await getPuter();
    const files = await puter.fs.list(path);
    return { success: true, data: files };
  } catch (error) {
    console.error('Failed to list files:', error);
    return { success: false, error, data: [] };
  }
}

export async function deleteFile(path) {
  try {
    const puter = await getPuter();
    await puter.fs.delete(path);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete file:', error);
    return { success: false, error };
  }
}

export async function createDirectory(path) {
  try {
    const puter = await getPuter();
    await puter.fs.mkdir(path, { recursive: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to create directory:', error);
    return { success: false, error };
  }
}
