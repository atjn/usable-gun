/**
 * @file
 * This ensures that usable-gun is published under the exact same license as gun.
 * 
 * I do this partly because I want to honor whatever license Mark has chosen as appropriate for his work,
 * and partly because I don't want to risk going to court for publishing under an illegal license :).
 */

import { baseDir, sourceDir } from "./setup.js";
import fs from "fs-extra";
import usableVersion from "../usable-version.js";
import { Link } from "./Link.js";

/**
 * Copies the NPM license field.
 */
async function updateVersion(){
	const packageName = "package.json";
	const gunVersion = (await fs.readJSON((new Link(packageName, sourceDir)).absolutePath)).version.split(".");

	if(gunVersion[0] !== "0") throw new Error("Gun is no longer in beta, this script should be refactored to take that into account");

	const publishedVersion = [
		gunVersion[0],
		`${gunVersion[1]}0${usableVersion.major}`,
		`${gunVersion[2]}0${usableVersion.minor}`,
	];


	const packageLink = new Link(packageName, baseDir);
	const packageData = await fs.readJson(packageLink.absolutePath);

	packageData.version = publishedVersion.join(".");

	await fs.writeJSON(packageLink.absolutePath, packageData, {spaces: 4});
}
await updateVersion();
