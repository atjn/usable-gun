import { fileURLToPath, pathToFileURL } from "node:url";
import { join as pathJoin, relative as pathRelative } from "node:path";
import { Link } from "./Link.js";

import fs from "fs-extra";
import tinyGlob from "tiny-glob";
import babel from "@babel/core";
import babelPluginMinifyDeadCodeElimination from "babel-plugin-minify-dead-code-elimination";
import { transform as lebabTransform } from "lebab";
import { format as prettierFormat } from "prettier";
import chalk from "chalk";
import stripAnsi from "strip-ansi";

import { ensureStartsWith, ensureEndsWith } from "./lib.js";
import { baseDir, rebuiltDir, usableLibUrl } from "./setup.js";
import { updateDependencies } from "./updateDependencies.js";
import stringReplacers from "./stringReplacers.js";

/**
 * A list of all the builtin values that will be wrapped if they are mutated.
 * TODO: find an absolute source for these instead of just maunally plugging them in.
 */
const builtins = ["Object", "Function", "Boolean", "Symbol", "Number", "BigInt", "Date", "Temporal", "String", "Array", "JSON", "Math", "setTimeout"];

/**
 * Global entries that are safe to access without a wrapper. Must adhere to the following:
 * - Gun does not try to mutate them, it only accesses them
 * - It is available in all js environments, so there would be no desire to polyfill them for gun.
 */
const safeGlobalEntries = ["location", "performance", "MessageChannel", "clearTimeout", "btoa", "atob", "setTimeout", "setInterval", "TextEncoder", "TextDecoder"];

/**
 * When wrapping global entries, they will by default be proxied to `globalThis`.
 * Some globals however, are only supported by `globalThis` when the `window` property is available, and can throw errors otherwise,
 * so they should be proxied directly to `window`.
 */
const globalsOnlyAvailableInWindow = ["window", "document"];

/**
 * A list of package imports that are node packages, as opposed to npm packages.
 */
const nodePackages = ["fs", "os", "v8", "path", "url", "crypto", "events", "process", "child_process", "http", "https", "buffer", "dgram"];

/**
 * When a file imports node/npm dependencies, there is no perfect way to do that.
 * Therefore, we have to manually determine the best of two strategies:
 * 
 * ## static
 * In this case, we make static imports.
 * Pro: The code will work sunchronously like it did before, which saves us a lot of headaches.
 * Con: The code will not work outside of environments with full node and npm support. (fx. the web)
 * 
 * ## dynamic
 * In this case, we make dynamic imports and await them. This means the plugin becomes async.
 * Pro: Some code can run in web environments because it  TODO
 * Con: It is very hard to transform all code TODO
 */
const externalImportStrategy = [
	["lib/aws.js",			"static"],
	["lib/crashed.js",		"dynamic"],
	["lib/email.js",		"dynamic"],
	["lib/evict.js",		"static"],
	["lib/file.js",			"static"],
	["lib/fsrm.js",			"static"],
	["lib/http.js",			"static"],
	["lib/hub.js",			"static"],
	["lib/les.js",			"dynamic"],
	["lib/level.js",		"dynamic"],
	["lib/memdisk.js",		"static"],
	["lib/mobile.js",		"static"],
	["lib/multicast.js",	"static"],
	["lib/radisk3.js",		"dynamic"],
	["lib/reboot.js",		"static"],
	["lib/rfs.js",			"static"],
	["lib/rs3.js",			"static"],
	["lib/stats.js",		"static"],
	["lib/uws.js",			"static"],
	["lib/verify.js",		"static"],
	["lib/wire.js",			"static"],
	["lib/ws.js",			"static"],
	["lib/wsp.js",			"static"],
	["lib/serve.js",		"static"],
].map(entry => {
	entry[0] = new Link(entry[0]);
	return entry;
});

const wrapperCode = (await fs.readFile((new Link("rebuild/wrapper/wrapper.js", baseDir)).absolutePath)).toString();

const paths = [
	...await tinyGlob(`${fileURLToPath(rebuiltDir)}{src,sea,lib}/**/*.js`, {absolute: true, filesOnly: true}),
	`${fileURLToPath(rebuiltDir)}as.js`,
	`${fileURLToPath(rebuiltDir)}axe.js`,
	`${fileURLToPath(rebuiltDir)}gun.js`,
	`${fileURLToPath(rebuiltDir)}nts.js`,
	`${fileURLToPath(rebuiltDir)}sea.js`,
];

const nameExpanders = [
	[["*"],				"u",	"undefined",			true],
	[["*"],				"sT",	"setTimeout",			true],
	[["src/shim.js"],	"sI",	"_setImmediate",		false],
	[["src/onto.js"],	"f",	"hasCallbackFunction",	false],
];

const topIndex = new Map();
const fileNeedsCustomImports = new Map();
const fileNeedsImports = new Map();
const fileNeedsCustomCalls = new Map();
const fileNeedsUsableWindow = new Map();
const fileNeedsUsableModule = new Map();
const fileNeedsUsableMODULE = new Map();
const fileNeedsUsableGlobalThis = new Map();

const fileIsAsync = new Map();
const fileIsImportedBy = new Map();

const builtinOverrides = new Map();

const npmPackages = new Set();

const reports = new Map();
const reportTemplate = [
	["usedStringReplacers",		"Used string replacers",		"green"],
	["expandedNames",			"Expanded names",				"blue"],
	["wrappedGlobals",			"Wrapped globals",				"blue"],
	["removedGlobalOverrides",	"Removed global overrides",		"blue"],
	["wrappedGlobalOverrides",	"Wrapped global overrides",		"blue"],
	["wrappedGlobalAccessors",	"Wrapped global accessors",		"blue"],
	["ignoredGlobalAccessors",	"Ignored global accessors",		"blue"],
	["wrappedPluginImports",	"Wrapped plugin imports",		"yellow"],
	["upgradedNodeImports",		"Upgraded node imports",		"yellow"],
	["upgradedNpmImports",		"Upgraded npm imports",			"yellow"],
	["removedBuiltinOverrides",	"Removed builtin overrides",	"green"],
	["wrappedBuiltinOverrides",	"Wrapped builtin overrides",	"green"],
	["wrappedBuiltinAccessors",	"Wrapped builtin accessors",	"green"],

	["isAsync",					"Is async",						"magenta"],
	["isImportedBy",			"Is imported by",				"yellow"],
];
/**
 *
 */
function newReport(){
	const report = {};
	for(const [key] of reportTemplate){
		report[key] = {};
	}
	return report;
}

console.log("Run string replacers, uprade requires, wrap globals, expand names");
await Promise.all(paths.map(async path => {
	const link = new Link(path);
	reports.set(link.absolutePath, newReport());

	let code = (await fs.readFile(link.absolutePath)).toString();

	code = runReplacers(code, link.absolutePath);

	code = wrapperCode.replace("/* usable_insert_code */", code);
	const exportMemberPaths = link.getRelativePath(rebuiltDir).replaceAll("-", "_").split(".")[0].split("/").map(p => p === "src" ? "gun" : p);
	if (exportMemberPaths.length === 1) exportMemberPaths.unshift("default");
	code = code.replaceAll("/* usable_insert_export_members */", `.${exportMemberPaths.join(".")}`);

	let output;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			upgradeRequires,
		],

	});
	code = output.code;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			getTopIndex,
			wrapGlobals,
		],

	});
	code = output.code;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			getTopIndex,
			nameDebugger,
			expandNames,
		],

	});
	code = output.code;

	await fs.writeFile(link.absolutePath, code);
}));

console.log("Propagate async calls, Wrap global/builtin overrides");
for(const filePath of fileIsAsync.keys()){
	makeImportersAsync(filePath);
}
/**
 *
 * @param filePath
 */
function makeImportersAsync(filePath){
	const importerPaths = fileIsImportedBy.get(filePath) || [];
	for(const importerPath of importerPaths){
		if(!fileIsAsync.get(importerPath)){
			fileIsAsync.set(importerPath, true);
			makeImportersAsync(importerPath);
		}
	}
}
await Promise.all(paths.map(async path => {
	const link = new Link(path);
	let code = (await fs.readFile(link.absolutePath)).toString();


	let output;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			propagateAsyncCalls,
		],

	});
	code = output.code;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			getTopIndex,
			wrapGlobalOverrides,
			wrapBuiltinOverrides,
		],

	});
	code = output.code;

	//if(path.endsWith("usable-gun/sea.js")) console.log({code});

	await fs.writeFile(link.absolutePath, code);
}));

console.log("Wrap global/builtin accessors, add imports, remove unused code");
await Promise.all(paths.map(async path => {
	const link = new Link(path);
	let code = (await fs.readFile(link.absolutePath)).toString();


	let output;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			getTopIndex,
			wrapGlobalAccessors,
			wrapBuiltinAccessors,
		],

	});
	code = output.code;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			getTopIndex,
			addImports,
		],

	});
	code = output.code;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			getTopIndex,
			addCalls,
		],

	});
	code = output.code;

	/**
	 * The dead code elimination plugin is extremely careful about not removing code that might have some weird sideeffect somewhere,
	 * which is good for gun code because it is sideefect hell.
	 * 
	 * However it also means that much of the unused wrapper code is kept for no reason, so we have our own plugin for removing that.
	 */
	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			removeUnusedWrapper,
			babelPluginMinifyDeadCodeElimination,
		],

	});
	code = output.code;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			removeDeadCode,
		],

	});
	code = output.code;

	output = babel.transformSync(code, {
		filename: link.absolutePath,
		plugins: [
			babelPluginMinifyDeadCodeElimination,
		],

	});

	await fs.writeFile(link.absolutePath, code);
}));

console.log("Upgrade code to ES6, enforce code style");
await Promise.all(paths.map(async path => {
	const link = new Link(path);
	let code = (await fs.readFile(link.absolutePath)).toString();


	let output;

	output = lebabTransform(
		code,
		[
			"multi-var",
			"arrow",
			"arrow-return",
			"for-of",
			"for-each",
			"arg-rest",
			"arg-spread",
			"obj-method",
			"obj-shorthand",
			"no-strict",
			"exponent",
		],
	);
	code = output.code;

	code = await prettierFormat(code, {
		filepath: link.absolutePath,
		useTabs: true,
	});

	// Useful for debugging:
	//for(const warning of output.warnings) console.warn(warning);

	await fs.writeFile(link.absolutePath, code);
}));

await updateDependencies(npmPackages);

for(const [filename, report] of reports.entries()){
	report.isAsync[fileIsAsync.get(filename) ? "Yes" : "No"] = 1;
}

for(const [filename, set] of fileIsImportedBy.entries()){	
	for(const importedBy of set){
		const link = new Link(importedBy);
		updateMap(reports, filename, report => {
			report.isImportedBy ??= {};
			report.isImportedBy[link.getRelativePath()] = 1;
		});
	}
}

let reportText = "";
let inTotal = newReport();
let inTotalGun = newReport();
let inTotalSea = newReport();
let inTotalOther = newReport();
for(const [filename, report] of reports.entries()){
	writeReport(filename, report);
	inTotal = mergeReports(inTotal, report);

	if((/(?:^|\/)(?:gun|src)(?:\/[^\/]*)?\.js$/ui).test(filename)){
		inTotalGun = mergeReports(inTotalGun, report);
	}else if((/(?:^|\/)sea(?:\/[^\/]*)?\.js$/ui).test(filename)){
		inTotalSea = mergeReports(inTotalSea, report);
	}else{
		inTotalOther = mergeReports(inTotalOther, report);
	}
}
writeReport("In total for gun root", inTotalGun);
writeReport("In total for sea", inTotalSea);
writeReport("In total for other", inTotalOther);
writeReport("In total", inTotal);
const reportsLink = new Link("reports/");
const reportLink = new Link("reports/report.md");
await fs.ensureDir(reportsLink.absolutePath);
await fs.writeFile(reportLink.absolutePath, stripAnsi(reportText).replaceAll("\n", "\n\n"));
console.log(reportText);

/**
 *
 * @param filename
 * @param report
 */
function writeReport(filename, report){
	reportText += `\n## ${  pathRelative(fileURLToPath(baseDir), filename)}`;
	for(const [key, name, color] of reportTemplate){
		if(Object.keys(report?.[key] || {}).length > 0) reportText += `\n  ${name.padEnd(25)}: ${displayEntries(color, report[key])}`;
	}
	reportText += "\n";
}
/**
 *
 * @param color
 * @param entries
 */
function displayEntries(color, entries){
	return Object.entries(entries)
		.map(([name, count]) => {
			const nameBits = name.split("|");
			nameBits[0] = chalk[color](nameBits[0]);
			for(let i = 1; i < nameBits.length; i++){
				nameBits[i] = chalk.blue(nameBits[i]);
			}
			const displayName = nameBits.join(".");
			const displayCount = count > 1 ? chalk.magenta(` x${count}`) : "";
			return `${displayName}${displayCount}`;
		})
		.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
		.join(", ");
}
/**
 *
 * @param reportA
 * @param reportB
 */
function mergeReports(reportA, reportB){
	const mergedReport = {};
	for(const [subject] of reportTemplate){
		mergedReport[subject] = {};
		for(const key of [...Object.keys(reportA[subject] || {}), ...Object.keys(reportB[subject] || {})]){
			mergedReport[subject][key] = Number(reportA[subject]?.[key] || 0) + Number(reportB[subject]?.[key] || 0);
		}
	}
	return mergedReport;
}

/**
 *
 * @param root0
 * @param root0.types
 */
function getTopIndex({ types: t }){
	return {
		visitor: {
			/**
			 * 
			 * @param {*} path 
			 * @param {*} param1 
			 */
			Program(path, { filename, file: {ast: { comments }}}){
				const comment = comments.find(candidate => candidate?.value === " BEGIN WRAPPED GUN CODE ");
				topIndex.set(filename, comment.loc.end.line);
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function upgradeRequires({ types: t }){
	return {
		visitor: {
			/**
			 * 
			 * @param {*} path 
			 * @param {*} param1 
			 */
			CallExpression(path, { filename }){
				let callee = path.get("callee");
				if(callee.isMemberExpression()) callee = callee.get("property");

				if(callee.node.name === "require") {
					let importPath = path.node.arguments[0].value;
					const importMatch = importPath.match(/^(?<pathIndicator>\.|\/)?.*?\/?(?<importName>(?:[\w\-_]+\/)?[\w\-_]+)(?:\.\w+)?$/u);
					const importType = (importMatch.groups.pathIndicator === undefined) ? "node" : "plugin";
					let expressionName;

					switch(importType){

						case "plugin": {
						
							let fileImportPath;

							fileImportPath = new URL(ensureEndsWith(importPath, ".js"), pathToFileURL(filename));
							if(fs.existsSync(fileImportPath)){
								importPath = ensureEndsWith(importPath, ".js");
							}else{
								fileImportPath = new URL(ensureEndsWith(importPath, "/index.js"), pathToFileURL(filename));
								if(fs.existsSync(fileImportPath)){
									importPath = ensureEndsWith(importPath, "/index.js");
								}else{
									/**
									 * A list of imports that straight up don't exist.
									 * It is not our fault that GUN plugins are trying to import nonexistent plugins.
									 */
									const acceptedFileImportFailures = [
										"../src/type",
									];
									if(!acceptedFileImportFailures.includes(importPath)){
										throw Error(`Unable to find a matching file for import "${importPath}" in ${filename}`);
									}
								}
							}
							

							const importFilename = importMatch.groups.importName.replaceAll("-", "_");
							const pluginName = camelCaseString(( `${importFilename}/Plugin`.replace(/(?<=^|\/)src(?=\/)/u, "gun") ), "/");
							updateMap(reports, filename, report => report.wrappedPluginImports[importFilename] = (report.wrappedPluginImports[importFilename] || 0) + 1);
							// base64 and text_encoding plugins are noops, might as well remove them
							if(pluginName.endsWith("ase64Plugin")){
								if(!path.removed) path.remove();
							}else if(pluginName.endsWith("ext_encodingPlugin")){
								path.replaceWith(
									t.ObjectExpression([
										t.ObjectProperty(
											t.Identifier("TextEncoder"),
											t.Identifier("TextEncoder"),
										),
										t.ObjectProperty(
											t.Identifier("TextDecoder"),
											t.Identifier("TextDecoder"),
										),
									]),
								);
							}else{
								expressionName = pluginName;
								path.node.callee.name = pluginName;
								path.node.arguments[0] = t.Identifier("__usable_environment");
								path.node.arguments.length = path.node.arguments[1]?.name?.includes("MODULE") ? 2 : 1;
								path.replaceWith(
									t.ExpressionStatement(path.node),
								);
							}

							if(expressionName !== undefined) addFileImport(filename, importPath, expressionName);

							break;
						}

						case "node": {
							let importName = path.node.arguments[0]?.value?.toLowerCase();
							if(nodePackages.includes(importName)) importName = ensureStartsWith(importName, "node:");
							const isNodePackage = importName.startsWith("node:");
							if(isNodePackage){
								const strippedImportName = importName.slice(5);
								updateMap(reports, filename, report => report.upgradedNodeImports[strippedImportName] = (report.upgradedNodeImports[strippedImportName] || 0) + 1);
							}else{
								if(importName !== "gun") npmPackages.add(importName);
								updateMap(reports, filename, report => report.upgradedNpmImports[importName] = (report.upgradedNpmImports[importName] || 0) + 1);
							}
							let importPath = importName;
							if(importPath === "ws"){
								const wrapperLink = new Link("usableLib/wsWrapper.js");
								importPath = pathRelative(pathJoin(filename, ".."), wrapperLink.absolutePath);
							}
							const strategy = externalImportStrategy.find(candidate => candidate[0].absolutePath === (new Link(filename)).absolutePath);
							if(!strategy) throw new Error(`No import strategy defined for file ${filename}`);
							
							if(strategy[1] === "dynamic"){
								path.replaceWith(
									t.MemberExpression(
										t.AwaitExpression(
											t.CallExpression(
												t.Import(),
												[
													t.StringLiteral(importPath),
												],
											),
										),
										t.Identifier("default"),
									),
								);
								makePathAsync(path, t);
								fileIsAsync.set(filename, true);
							}else if(strategy[1] === "static"){
								const importLocalName = `__import_${importName.replaceAll("-", "_").replaceAll(":", "_")}`;
								path.replaceWith(
									t.Identifier(importLocalName),
								);
								addNpmImport(filename, importPath, importLocalName);
							}
							return;
						}

					}

					
				}
			},
		},
	};
}
/**
 *
 * @param filename
 * @param importPath
 * @param expressionName
 */
function addFileImport(filename, importPath, expressionName){

	if(!fileNeedsImports.has(filename)) fileNeedsImports.set(filename, new Map());
	const importMap = fileNeedsImports.get(filename);
	if(!importMap.has(importPath)){
		importMap.set(importPath, {
			name: expressionName,
		});
	}

	const absoluteImportPath = new Link(importPath, pathJoin(filename, "..")).absolutePath;
	if(!fileIsImportedBy.has(absoluteImportPath)) fileIsImportedBy.set(absoluteImportPath, new Set());
	const importedSet = fileIsImportedBy.get(absoluteImportPath);
	importedSet.add(filename);

}
/**
 *
 * @param filename
 * @param importPath
 * @param expressionName
 */
function addNpmImport(filename, importPath, expressionName){

	if(!fileNeedsImports.has(filename)) fileNeedsImports.set(filename, new Map());
	const importMap = fileNeedsImports.get(filename);
	if(!importMap.has(importPath)){
		importMap.set(importPath, {
			name: expressionName,
		});
	}

}
/**
 *
 * @param filename
 * @param importPath
 * @param expressionName
 */
function addCustomFileImport(filename, importPath, expressionName){
	if(!fileNeedsCustomImports.has(filename)) fileNeedsCustomImports.set(filename, new Map());
	const importMap = fileNeedsCustomImports.get(filename);
	if(!importMap.has(importPath)){
		importMap.set(importPath, {
			name: expressionName,
		});
	}
}
/**
 *
 * @param filename
 * @param callName
 */
function addCustomCall(filename, callName){
	if(!fileNeedsCustomCalls.has(filename)) fileNeedsCustomCalls.set(filename, new Map());
	const importMap = fileNeedsCustomCalls.get(filename);
	if(!importMap.has(callName)){
		importMap.set(callName, true);
	}
}
/**
 *
 * @param path
 */
function makePathAsync(path, t){
	while(path !== null){
		if(path.node.async !== undefined){
			path.node.async = true;
		}
		if(path.isCallExpression() && !path.parentPath.isAwaitExpression()){
			path.replaceWith(
				t.AwaitExpression(
					path.node,
				),
			);
		}
		path = path.parentPath;
	}
}

/**
 *
 * @param root0
 * @param root0.types
 */
function addImports({ types: t }){
	return {
		visitor: {
			/**
			 * 
			 * @param {*} path 
			 * @param {*} param1 
			 */
			Program(path, { filename }){
				const customImportMap = fileNeedsCustomImports.get(filename);
				const standardImportMap = fileNeedsImports.get(filename);
				
				for(const importMap of [ standardImportMap, customImportMap ]){
					if(!importMap) continue;

					// We reverse the list because this allows the imports to be listed in the same order as they're used
					for(const [ importPath, { name } ] of [...importMap.entries()].reverse()){
						path.unshiftContainer("body", t.importDeclaration(
							[t.ImportDefaultSpecifier(t.Identifier(name))],
							t.StringLiteral(importPath),
						));
					}
				}
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function nameDebugger({ types: t }){
	return {
		visitor: {
			Identifier(path, { filename }){
				if(path.node.name === "console"){
					path.replaceWith(
						t.Identifier("debug"),
					);
				}
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function addCalls({ types: t }){
	return {
		visitor: {
			/**
			 * 
			 * @param {*} path 
			 * @param {*} param1 
			 */
			ExportDefaultDeclaration(path, { filename }){
				const callMap = fileNeedsCustomCalls.get(filename);
				if(!callMap) return;

				const fileTop = topIndex.get(filename);

				const anchor = path.get("declaration").get("body").get("body").find(path => path.node?.loc?.start?.line > fileTop);
				if(!anchor) return;

				for(const name of callMap.keys()){
					anchor.insertBefore(
						t.ExpressionStatement(
							t.CallExpression(
								t.Identifier(name),
								[
									t.Identifier("__usable_environment"),
								],
							),
						),
					);
				}
				
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function propagateAsyncCalls({ types: t }){
	return {
		visitor: {
			/**
			 * 
			 * @param {*} path 
			 * @param {*} param1 
			 */
			CallExpression(path, { filename }){
				if(!fileIsAsync.get(filename)) return;
				if(!path.get("callee").node?.name?.endsWith("Plugin")) return;
				if(path.parentPath.isAwaitExpression()) return;
				const pluginName = path.get("callee").node.name;

				const importMap = fileNeedsImports.get(filename);
				
				let foundName = false;
				for(const [ importPath, { name } ] of importMap.entries()){
					if(name === pluginName){
						const importLink = new Link(importPath, pathJoin(filename, ".."));
						if(fileIsAsync.get(importLink.absolutePath)){
							path.replaceWith(
								t.AwaitExpression(
									path.node,
								),
							);
							makePathAsync(path, t);
						}
						foundName = true;
						break;
					}
				}
				if(!foundName) throw new Error(`Unable to find import path for plugin ${pluginName}`);
	
				
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function wrapGlobals({ types: t }){
	return {
		visitor: {
			Identifier(path, { filename }){
				const fileTop = topIndex.get(filename);
				const name = path.node.name;
				if(name.startsWith("__usable_") || name.endsWith("Plugin") || path.node.loc.start.line <= fileTop){
					return;
				}else if(name === "window"){
					const memberExpression = path.findParent(path => path.isMemberExpression());
					if (!memberExpression || memberExpression.get("object") === path){
						updateMap(reports, filename, report => report.wrappedGlobals[name] = (report.wrappedGlobals[name] || 0) + 1);
						path.replaceWith(
							t.Identifier("__usable_window"),
						);
						fileNeedsUsableWindow.set(filename, true);
					}
				}else if(name === "self" || name === "global" || name === "globalThis"){
					const memberExpression = path.findParent(path => path.isMemberExpression());
					if (!memberExpression || memberExpression.get("object") === path){
						updateMap(reports, filename, report => report.wrappedGlobals[name] = (report.wrappedGlobals[name] || 0) + 1);
						path.replaceWith(
							t.Identifier("__usable_globalThis"),
						);
						fileNeedsUsableGlobalThis.set(filename, true);
					}
				}else if(name === "MODULE"){
					const memberExpression = path.findParent(path => path.isMemberExpression());
					if (!memberExpression || memberExpression.get("object") === path){
						updateMap(reports, filename, report => report.wrappedGlobals[name] = (report.wrappedGlobals[name] || 0) + 1);
						path.replaceWith(
							t.Identifier("__usable_MODULE"),
						);
						fileNeedsUsableMODULE.set(filename, true);
					}
				}else if(name === "module"){
					const memberExpression = path.findParent(path => path.isMemberExpression());
					if (!memberExpression || memberExpression.get("object") === path){
						updateMap(reports, filename, report => report.wrappedGlobals[name] = (report.wrappedGlobals[name] || 0) + 1);
						path.replaceWith(
							t.Identifier("__usable_module"),
						);
						fileNeedsUsableModule.set(filename, true);
					}
				}
			},
			
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function wrapGlobalOverrides({ types: t }){
	return {
		visitor: {
			AssignmentExpression(path, { filename }){
				const fileTop = topIndex.get(filename);
				if(path.node.loc.start.line <= fileTop){
					return;
				}
				let baseObject = path.get("left");
				const baseObjectScope = [];
				while(baseObject.isMemberExpression() || baseObject.isOptionalMemberExpression()){
				  baseObjectScope.unshift(baseObject.get("property").node.name);
				  baseObject = baseObject.get("object");
				}
				baseObjectScope.unshift(baseObject.node.name);
				const scopeString = baseObjectScope.join("|");
				const name = baseObject.node.name;
				if(!baseObject.isIdentifier() || name.startsWith("__usable_") || name.startsWith("__import_") || name.endsWith("Plugin") || builtins.includes(name) || path.scope.hasBinding(name)) return;
				/**
				 * Gun should let the developer decide when their application wants to update its URL.
				 * We remove all instances that set anything on location.
				 */
				if(baseObjectScope[0] === "location"){
					updateMap(reports, filename, report => report.removedGlobalOverrides[scopeString] = (report.removedGlobalOverrides[scopeString] || 0) + 1);
					if(!path.removed) path.remove();
				}else{
					if(safeGlobalEntries.includes(name)) throw new TypeError(`The global entry "${name}" is marked as "safe", but is being overridden by this plugin`);
					updateMap(reports, filename, report => report.wrappedGlobalOverrides[name] = (report.wrappedGlobalOverrides[name] || 0) + 1);
					baseObject.replaceWith(
						t.MemberExpression(
							t.Identifier("__usable_globalThis"),
							baseObject.node,
						),
					);
					fileNeedsUsableGlobalThis.set(filename, true);
				}
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function wrapGlobalAccessors({ types: t }){
	return {
		visitor: {
			Identifier(path, { filename }){
				const fileTop = topIndex.get(filename);
				const name = path.node.name;
				if(name.startsWith("__usable_") || name.startsWith("__import_") || name.endsWith("Plugin") || path.node.loc?.start?.line <= fileTop || path.scope.hasBinding(name)){
					return;
				}
				if(safeGlobalEntries.includes(name)){
					updateMap(reports, filename, report => report.ignoredGlobalAccessors[name] = (report.ignoredGlobalAccessors[name] || 0) + 1);
					return;
				}
				if(!isPartOfIdForVariableDeclaration(path)){
					if (isGlobalScope(path)){
						const onlyWindow = globalsOnlyAvailableInWindow.includes(name);
						updateMap(reports, filename, report => report.wrappedGlobalAccessors[name] = (report.wrappedGlobalAccessors[name] || 0) + 1);
						path.replaceWith(
							t.MemberExpression(
								t.Identifier(onlyWindow ? "__usable_window" : "__usable_globalThis"),
								path.node,
							),
						);
						onlyWindow ? fileNeedsUsableWindow.set(filename, true) : fileNeedsUsableGlobalThis.set(filename, true);
					}
				}
				
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function expandNames({ types: t }){
	return {
		visitor: {
			Identifier(path, { filename }){
				const fileTop = topIndex.get(filename);
				const name = path.node.name;
				if(!isGlobalScope(path)){
					return;
				}
				//TODO: ensure this filter works
				const expandersForFile = nameExpanders.filter(candidate => candidate[0][0] === "*" || filename.endsWith(candidate[0]));
				for(const [match, originalName, newName, isGlobalNow] of expandersForFile){
					if(path.node.name === originalName){
						updateMap(reports, filename, report => report.expandedNames[newName] = (report.expandedNames[newName] || 0) + 1);
						const variableDec = isPartOfIdForVariableDeclaration(path);
						if(variableDec && isGlobalNow){
							variableDec.remove();
						}else{
							path.replaceWith(
								t.Identifier(newName),
							);
						}
					}
				}
				
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function wrapBuiltinOverrides({ types: t }){
	return {
		visitor: {
			AssignmentExpression(path, { filename }){
				let baseObject = path.get("left");
				const baseObjectScope = [];
				while(baseObject.isMemberExpression()){
					baseObjectScope.unshift(baseObject.get("property").node.name);
					baseObject = baseObject.get("object");
				}
				baseObjectScope.unshift(baseObject.node.name);
				const scopeString = baseObjectScope.join("|");
				const camelCasedScope = camelCaseString(scopeString, "|");
				/**
				 * This is a special case, trying to polyfill Object.keys.
				 * Support is only missing in ancient browsers, so instead of cluttering the code, we just remove it.
				 */
				if(baseObjectScope[0] === "Object" && baseObjectScope[1] === "keys"){
					updateMap(reports, filename, report => report.removedBuiltinOverrides[scopeString] = (report.removedBuiltinOverrides[scopeString] || 0) + 1);
					if(!path.removed) path.remove();
				}else if(builtins.includes(baseObject.node.name)){
					updateMap(reports, filename, report => report.wrappedBuiltinOverrides[scopeString] = (report.wrappedBuiltinOverrides[scopeString] || 0) + 1);
					path.get("left").replaceWith(
						t.MemberExpression(
							t.Identifier("__usable_globalThis"),
							t.Identifier(camelCasedScope),
						),
					);
					fileNeedsUsableGlobalThis.set(filename, true);
					builtinOverrides.set(scopeString, true);
				}
			},
		},
	};
}

/**
 *
 * @param root0
 * @param root0.types
 */
function wrapBuiltinAccessors({ types: t }){
	return {
		visitor: {
			Identifier(path, { filename }){
				if(!builtins.includes(path.node.name)) return;

				let parentMemberExpression = path;
				const memberScope = [path.node.name];
				while(parentMemberExpression.parentPath.isMemberExpression()){
					parentMemberExpression = parentMemberExpression.parentPath;
					memberScope.push(parentMemberExpression.get("property").node.name);
				}
				const scopeString = memberScope.join("|");
				const camelCasedScope = camelCaseString(scopeString, "|");
				if(builtinOverrides.has(scopeString) || scopeString === "Math|random"){
					updateMap(reports, filename, report => report.wrappedBuiltinAccessors[scopeString] = (report.wrappedBuiltinAccessors[scopeString] || 0) + 1);
					parentMemberExpression.replaceWith(
						t.MemberExpression(
							t.Identifier("__usable_globalThis"),
							t.Identifier(camelCasedScope),
						),
					);
					fileNeedsUsableGlobalThis.set(filename, true);
				}
				if(scopeString === "Math|random"){
					const absoluteImportPath = new Link("./mathRandomPlugin.js", usableLibUrl).absolutePath;
					const relativeImportPath = `./${pathRelative(pathJoin(filename, ".."), absoluteImportPath)}`;
					addCustomFileImport(filename, relativeImportPath, "mathRandomPlugin");
					addCustomCall(filename, "mathRandomPlugin");
				}
			},
		},
	};
}


/**
 *
 * @param path
 */
function isPartOfIdForVariableDeclaration(path){
	let lastPath;
	while(path){
		if(path.isVariableDeclarator()){
			if(path.get("id") === lastPath){
				return path;
			}else{
				return null;
			}
		}
		if(path.isBlockStatement() || path.isReturnStatement()){
			return null;
		}
		lastPath = path;
		path = path.parentPath;
	}
	return null;
}

/**
 *
 * @param path
 */
function isGlobalScope(path){
	let lastPath;
	let result = false;
	while(path){
		if(path.isMemberExpression() || path.isOptionalMemberExpression()){
			if(path.get("object") === lastPath){
				result = true;
				break;
			}else{
				return false;
			}
		}
		if(path.isObjectProperty()){
			if(path.get("value") === lastPath){
				result = true;
				break;
			}else{
				return false;
			}
		}
		if(path.isObjectMethod()){
			return false;
		}
		if(path.isBlockStatement() || path.isReturnStatement() || path.isAssignmentExpression() ){
			result = true;
			break;
		}
		lastPath = path;
		path = path.parentPath;
	}
	return result;
}



/**
 *
 * @param scopeString
 * @param splitter
 */
function camelCaseString(scopeString, splitter){
	return Object.entries(scopeString.split(splitter))
		.map(([index, key]) => {
			if(index == 0){
				key = key.toLowerCase();
			}else{
				key = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
			}
			return key;
		})
		.join("");
}

/**
 *
 */
function removeUnusedWrapper(){
	return {
		visitor: {
			Identifier(path, { filename }){
				const name = path.node.name;
				if(!name.startsWith("__usable_")){
				  return;
				}else{
					const enclosingScope = path.findParent(path => (
						path.parentPath?.isProgram() ||
						path.parentPath?.isBlockStatement() ||
						path.parentPath?.isReturnStatement()
					));
					if(enclosingScope && enclosingScope.removed === false){
						if(name === "__usable_window" && !fileNeedsUsableWindow.has(filename)){
							enclosingScope.remove();
						}else if(name === "__usable_MODULE" && !fileNeedsUsableMODULE.has(filename) && path.parentPath.isFunctionDeclaration() && path.parentPath.parentPath.isExportDefaultDeclaration()){
							path.remove();
						}else if(name === "__usable_module" && !fileNeedsUsableModule.has(filename)){
							enclosingScope.remove();
						}else if(name === "__usable_globalThis" && !fileNeedsUsableGlobalThis.has(filename)){
							enclosingScope.remove();
						}
					}
				}
			},
		},
	};
}

/**
 *
 */
function removeDeadCode(){
	return {
		visitor: {
			BlockStatement(path){
				let returned = false;
				for(const childPath of path.get("body")){
					if(returned === true){
						if(!childPath.isFunctionDeclaration()){
							childPath.remove();
						}
					}
					if(childPath.isReturnStatement()){
						returned = true;
					}
				}
			},
		},
	};
}


/**
 *
 * @param code
 * @param filename
 */
function runReplacers(code, filename){

	


	for(const [originalSnippet, newSnippet, friendlyName] of stringReplacers){
		let previousCode;
		while(previousCode !== code){
			if(previousCode !== undefined) updateMap(reports, filename, report => report.usedStringReplacers[friendlyName] = (report.usedStringReplacers[friendlyName] || 0) + 1);
			previousCode = code;
			code = code.replace(originalSnippet, newSnippet);
		}
	}

	return code;
}

/**
 *
 * @param map
 * @param key
 * @param updater
 */
function updateMap(map, key, updater){
	const value = map.get(key) ?? {};
	updater(value);
	map.set(key, value);
}

/**
 *
 * @param map
 * @param key
 * @param accessors
 */
function incrementMapObjectKey(map, key, accessors){

}
