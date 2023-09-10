let __usable_isActivated = false;
export default function (__usable_environment) {
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

	__usable_globalThis.debug.log(
		"IPFS PLUGIN NOT OFFICIALLY MAINTAINED! PROBABLY WON'T WORK! USE AT YOUR OWN RISK! PLEASE CONTRIBUTE FIXES!",
	);
	var opt = __usable_globalThis.gun._.opt;
	if (undefined === opt.ipfs.directory) {
		opt.ipfs.directory = "/gun";
	}
	opt.store = {};
	opt.store.put = (file, data, cb) => {
		var uri = opt.ipfs.directory + "/" + file;
		opt.ipfs.instance.files
			.write(uri, __usable_globalThis.Buffer.from(JSON.stringify(data)), {
				create: true,
			})
			.then((res) => {
				__usable_globalThis.debug.log(
					"File written to IPFS directory",
					uri,
					res,
				);
				return opt.ipfs.instance.files.stat(opt.ipfs.directory, {
					hash: true,
				});
			})
			.then((res) => {
				__usable_globalThis.debug.log("Directory hash:", res.hash);
				return opt.ipfs.instance.name.publish(res.hash);
				// currently throws "This command must be run in online mode. Try running 'ipfs daemon' first." for some reason, maybe js-ipfs IPNS not ready yet
			})
			.then((res) => {
				__usable_globalThis.debug.log("IPFS put request successful:", res);
				cb(undefined, 1);
			})
			.catch((error) => {
				__usable_globalThis.debug.error("IPFS put request failed", error);
			});
	};
	opt.store.get = (file, cb) => {
		var uri = opt.ipfs.directory + "/" + file;
		opt.ipfs.instance.files.read(uri, {}).then((res) => {
			var data = JSON.parse(res.toString());
			__usable_globalThis.debug.log(uri + " was loaded from ipfs:", data);
			cb(data);
		});
	};
	opt.store.list = (cb) => {
		var stream = opt.ipfs.files.lsReadableStream(opt.ipfs.directory);
		stream.on("data", (file) => {
			__usable_globalThis.debug.log("ls", file.name);
			if (cb(file.name)) {
				stream.destroy();
			}
		});
		stream.on("finish", () => {
			cb();
		});
	};
}
