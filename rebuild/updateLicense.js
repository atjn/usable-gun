/**
 * @file
 * This ensures that usable-gun is published under the exact same license as gun.
 * 
 * I do this partly because I want to honor whatever license Mark has chosen as appropriate for his work,
 * and partly because I don't want to risk going to court for publishing under an illegal license :).
 */

import { baseDir, sourceDir } from "./setup.js";
import fs from "fs-extra";

const copyrightHolder = "Anton";

/**
 * Copies the license field.
 */
async function copyLicense(){
	const originalLicenseName = "LICENSE.md";
	const newLicenseName = "LICENSE";

	const originalCopyrightMatcher = /\bcopyright[ \t]*(?:\s*\(c\)|\s*©)?[ \t]*(?:\s*\d{4}|\d{2}|\d{5})[ \t]*?(?:[ \-\t\b]\w+)*\b/gmui;
	const newCopyrightLine = `Copyright (c) ${new Date().getFullYear()} ${copyrightHolder}`;

	const originalLicense = (await fs.readFile(new URL(originalLicenseName, sourceDir))).toString();

	const newLicense = originalLicense.replaceAll(originalCopyrightMatcher, newCopyrightLine);

	await fs.writeFile(new URL(newLicenseName, baseDir), newLicense);
}
await copyLicense();

/**
 * Copies the NPM license field.
 */
async function copyLicenseField(){
	const packageName = "package.json";
	const licenseFieldKey = "license";

	const originalLicenseValue = (await fs.readJSON(new URL(packageName, sourceDir)))[licenseFieldKey];

	const packageURL = new URL(packageName, baseDir);
	const packageData = await fs.readJson(packageURL);

	packageData[licenseFieldKey] = originalLicenseValue;

	await fs.writeJSON(packageURL, packageData, {spaces: 4});
}
await copyLicenseField();
