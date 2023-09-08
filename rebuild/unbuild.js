import { argv } from "node:process";
import { join as pathJoin } from "node:path";

import fs from "fs-extra";

import { ensureEndsWith } from "./lib.js";
import { rebuiltDir } from "./setup.js";
import { Link } from "./Link.js";

const originalPath = argv[2] || "gun";
const originalPathMatch = originalPath.match(/(?:^|\/)(?<fileName>[\w\-_]+)(?:\.\w+)?$/u);
const newPath = ensureEndsWith(originalPath === "gun" ? "src" : originalPath, "/");
const newRelativePath = ensureEndsWith(originalPathMatch.groups.fileName === "gun" ? "src" : originalPathMatch.groups.fileName, "/");

const newAbsolutePath = (new Link(newPath, rebuiltDir)).absolutePath;

await fs.ensureDir(newAbsolutePath);

console.log("Rebuild:", `${originalPath}.js => ${newPath}`);

let sourceCode = read(ensureEndsWith(originalPath, ".js"));

// Removes the USE bundler that the original GUN uses, we will replace it with a standard bundler.
sourceCode = sourceCode.replace(/(?:\/\* UNBUILD \*\/|function\s+USE\s*\().*\/\* UNBUILD \*\//su, "");

const useBlocks = [...matchUseBlocks(sourceCode)];
for(const [index, useBlock] of Object.entries(useBlocks)){
	let code = useBlock.groups.code;
	const fpath = useBlock.groups.path;
	const isFirst = Number(index) === 0;
	const isLast = Number(index) === useBlocks.length -1;
	
	code = code.replaceAll(/\bUSE\(/gu, "require(");
	write(ensureEndsWith(fpath, ".js"), code);
	sourceCode = sourceCode.replace(
		useBlock[0], 
		`${isFirst ? "const MODULE = {};\n" : ""}require("./${pathJoin(`${newRelativePath}${fpath}`)}", MODULE);${isLast ? "\nmodule.exports = MODULE.exports;" : ""}`
	);
}


await fs.writeFile(ensureEndsWith(originalPath, ".js"), sourceCode);


/**
 *
 * @param path
 */
function read(path){
	return fs.readFileSync(new URL(path, rebuiltDir)).toString();
}

/**
 *
 * @param path
 * @param data
 */
function write(path, data){
	return fs.writeFileSync((new Link(path, newAbsolutePath)).absolutePath, data);
}

/**
 *
 * @param code
 */
function matchUseBlocks(code){
	return code.matchAll(/;?USE\(function\(module\)\{(?<code>.*?)\}\)\(USE\s*,\s*['"](?<path>[^'"]*)['"]\s*\);?/sgu);
}

