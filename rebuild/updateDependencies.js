import { baseDir } from "./setup.js";
import fs from "fs-extra";
import { Link } from "./Link.js";

export async function updateDependencies(dependencies){
	dependencies = [...dependencies].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
	const packageName = "package.json";

	const packageLink = new Link(packageName, baseDir);
	const packageData = await fs.readJson(packageLink.absolutePath);

	packageData.optionalDependencies = {};

	for(const dependency of dependencies){
		packageData.optionalDependencies[dependency] = "*";//`^${await latestVersion(dependency)}`;
	};

	await fs.writeJSON(packageLink.absolutePath, packageData, {spaces: 4});
}
