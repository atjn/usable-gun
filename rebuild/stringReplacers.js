

export default [

	/**
	 * Format is: [ string to match, string to replace it with, friendly name for reports ].
	 */

	// Removes if statements with a missing execution block (syntax error).
	[/\sif\(\)\s*\}/sgu, "}", "remove if statement syntax error"],

	/**
	 * GUN often uses this overkill method to generate the string "undefined".
	 * Replacing it makes the code more readable.
	 */
	[/''\s*\+\s*u(?!\w)/sgu, `"undefined"`, "remove undefined generator hack (variant 1)"],
	[/(?<!\w)u\s*\+\s*''/sgu, `"undefined"`, "remove undefined generator hack (variant 2)"],

	/**
	 * This line tests whether the plugin is running in the custom USE bundler, to determine where an import is located.
	 * The test will always fail, and it is pretty hard to transform it, so we remove it here.
	 */
	[/\("undefined"\s*={2,3}\s*typeof\s*MODULE\s*\?\s*'\.'\s*:\s*''\)\s*\+\s*'\./sgu, `'..`, "remove USE bundler test"],

	/**
	 * This is not necessary, TextEncoder and TextDecoder are available in all modern environments.
	 */
	[`import { TextEncoder, TextDecoder } from "text-encoding"`, "", "remove text-encoder import"],

	/**
	 * The wrapper can't handle static imports right now, so we transform it to a require and let the wrapper upgrade it in a compatible way.
	 */
	[`import Buffer from "buffer"`, `let Buffer = require("node:buffer")`, "downgrade buffer import"],

	/**
	 * Most of SEA becomes async because of this import that tries to polyfill something that is available in all modern environments.
	 * Easier to just remove it.
	 */
	[/require\s*\(\s*['"](?:node:)?crypto['"].*?\)/sgu, "crypto", "remove node crypto import"],
	[/require\s*\(\s*['"]@peculiar\/webcrypto['"].*?\)/sgu, "undefined", "remove npm crypto import"],
	[/\.log\s*\(\s*['"]Please `npm install @peculiar\/webcrypto` or add it to your package.json !['"]\s*\)/sgu, `.error("Please use an environment that supports the crypto API")`, "correct crypto import warning"],
	[/var\s+crypto\s*=\s*crypto/sgu, "", "remove dangerous crypto overrider"],

	/**
	 * SEA thinks it can redirect the user automatically, but this is bad practice and is stripped from usable-gun.
	 * Therefore, we should change the error message to reflect the situation.
	 */
	[`.warn('HTTPS needed for WebCrypto in SEA, redirecting...')`, `.error("SEA needs to run in a secure context (HTTPS) to run cryptographic operations.")`, "correct SEA HTTPS warning"],

	/**
	 * The console is being written to a debugger, so logging this message will just clutter the debugger.
	 * I have replicated the message in the GunEnvironment to make sure it gets is normal amount of exposure.
	 */
	[`Gun.log.once("welcome", "Hello wonderful person! :) Thanks for using GUN, please ask for help on http://chat.gun.eco if anything takes you longer than 5min to figure out!");`, "/* Moved to GunEnvironment :) */", "remove welcome log"],

];
