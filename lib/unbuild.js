import fsrmPlugin from "./fsrm.js";
let __usable_isActivated = false;
export default async function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;
	const __usable_globalThis = new Proxy(
		"window" in globalThis ? window : globalThis,
		{
			get(target, property) {
				if (["window", "globalThis", "global"].includes(property)) {
					return __usable_globalThis;
				} else if (__usable_environment.library[property] !== undefined) {
					return __usable_environment.library[property];
				} else if ("window" in globalThis) {
					return window[property];
				} else {
					return globalThis[property];
				}
			},
			set(object, property, value) {
				__usable_environment.library[property] = value;
				return true;
			},
		},
	);
	/* BEGIN WRAPPED GUN CODE */

	var fs = (await import("node:fs")).default;
	var nodePath = (await import("node:path")).default;
	var dir = __usable_globalThis.__dirname + "/../";
	var read = (path) => fs.readFileSync(nodePath.join(dir, path)).toString();
	var write = (path, data) => fs.writeFileSync(nodePath.join(dir, path), data);
	var rm = await fsrmPlugin(__usable_environment);
	var mk = (path) => {
		path = nodePath.join(dir, path);
		if (fs.existsSync(path)) {
			return;
		}
		fs.mkdirSync(path);
	};
	var rn = (path, newPath) => {
		path = nodePath.join(dir, path);
		newPath = nodePath.join(dir, newPath);
		if (fs.existsSync(newPath)) {
			return;
		}
		fs.renameSync(path, newPath);
	};
	var between = (text, start, end) => {
		end = end || start;
		var s = text.indexOf(start);
		if (s < 0) {
			return "";
		}
		s += start.length;
		var e = text.indexOf(end, s);
		if (e < 0) {
			return "";
		}
		var code = text.slice(s, e);
		return {
			s,
			t: code,
			e,
		};
	};
	var next = (start, end) => {
		end = end || start;
		if (!next.text) {
			next.text = start;
			return;
		}
		var code = between(next.text, start, end);
		next.text = next.text.slice(code.e + end.length);
		return code.t;
	};
	var path = (p) => {
		var code = next(",", ")");
		var path;
		try {
			path = eval(code);
		} catch (e) {
			__usable_globalThis.debug.log("fail", e);
		}
		if (!path) {
			return;
		}
		if (".js" !== path.slice(-3)) {
			path += ".js";
		}
		return nodePath.join("./" + (p || "src"), path);
	};
	var undent = (code, n) => {
		var regex = /\n\t\t/g;
		if (1 === n) {
			regex = /\n\t/g;
		}
		return code.replace(regex, "\n");
	};
	(() => {
		var arg = __usable_globalThis.process.argv[2] || "gun";
		var g;
		if ("gun" === arg) {
			g = "gun";
			rn("./src", "./old_src");
			mk("./src");
			mk("./src/polyfill");
			mk("./src/adapters");
		} else {
			g = arg;
			rn("./" + arg, "./old_" + arg);
			mk("./" + arg);
		}
		__usable_globalThis.debug.log("unbuild:", arg + ".js");
		var f = read(arg + ".js");
		var code = next(f);
		code = next("/* UNBUILD */");
		if ("gun" === g) {
			write("src/polyfill/unbuild.js", undent(code, 1));
			arg = "";
		}
		(function recurse() {
			code = next(";USE(function(module){", "})(USE");
			if (!code) {
				return;
			}
			var file = path(arg);
			if (!file) {
				return;
			}
			code = code.replace(/\bUSE\(/g, "require(");
			code = undent(code);
			var rcode;
			try {
				rcode = read("old_" + file);
			} catch (e) {}
			// console.log(rcode);
			if (rcode != code) {
				__usable_globalThis.debug.log("unbuild:", "update", file);
			}
			write(file, code);
			recurse();
		})();
		if ("gun" === g) {
			rm("./old_src");
		} else {
			rm("./old_" + g);
		}
	})();
	return;
}
