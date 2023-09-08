import nodePath from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { baseDir } from "./setup.js";

export class Link{
	constructor(path, basePath){
		path = normalizePath(path);

		if(basePath === undefined && nodePath.isAbsolute(path)){
			this.absolutePath = path;
		}else{
			this.setRelativePath(path, basePath);
		}
	}

	#absolutePath = "";
	get absolutePath(){
		return this.#absolutePath;
	}
	set absolutePath(path){
		path = normalizePath(path);
		path = nodePath.resolve(path);
		this.#absolutePath = path;
	}

	get url(){
		return pathToFileURL(this.absolutePath);
	}

	getRelativePath(basePath = baseDir){
		basePath = normalizePath(basePath);
		return nodePath.relative(basePath, this.absolutePath);
	}
	setRelativePath(path, basePath = baseDir){
		path = normalizePath(path);
		basePath = normalizePath(basePath);
		this.absolutePath = nodePath.join(basePath, path);
	}

	toJSON(){
		return this.absolutePath;
	}

	toString(){
		return this.getRelativePath();
	}

}

/**
 *
 * @param path
 */
function normalizePath(path){
	if(path instanceof Link){
		path = path.absolutePath;
	}else if(path instanceof URL){
		path = fileURLToPath(path);
	}
	path = nodePath.normalize(path);
	return path;
}
