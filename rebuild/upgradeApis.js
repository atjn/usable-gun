import fs from "fs-extra";
import chalk from "chalk";


await fs.emptyDir("lib/text-encoding");

await fs.writeFile("lib/text-encoding/index.js", 
	`
console.warn("The \`TextEncoder\` and \`TextDecoder\` methods are available in all modern environments, no need to polyfill them.");
module.exports = {
	TextEncoder,
	TextDecoder,
};
`);
console.log(`Upgraded ${chalk.green("TextEncoder")} and ${chalk.green("TextDecoder")} in lib/text-encoding`);

await fs.writeFile("sea/base64.js", 
	`
console.warn("The methods \`btoa\` and \`atob\` are available in all modern environments, no need to polyfill them.");
`);
console.log(`Upgraded ${chalk.yellow("btoa")} and ${chalk.yellow("atob")} in sea/base64.js`);
