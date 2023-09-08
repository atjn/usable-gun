
export const baseDir = new URL("../", import.meta.url);
export const sourceDir = new URL("gunSource/", baseDir);
export const rebuiltDir = baseDir;
export const rebuiltGunSrc = new URL("src/", rebuiltDir);
export const usableImportUrl = new URL("lib/usableImport.js", rebuiltDir);
export const usableLibUrl = new URL("./usableLib/", rebuiltDir);
