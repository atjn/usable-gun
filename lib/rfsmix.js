import rfsPlugin from "./rfs.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	/* BEGIN WRAPPED GUN CODE */

	__usable_module.exports = (opt, store) => {
		var rfs = rfsPlugin(__usable_environment)(opt);
		var p = store.put;
		var g = store.get;
		store.put = (file, data, cb) => {
			var a;
			var b;

			var c = (err, ok) => {
				if (b) {
					return cb(err || b);
				}
				if (a) {
					return cb(err, ok);
				}
				a = true;
				b = err;
			};

			p(file, data, c); // parallel
			rfs.put(file, data, c); // parallel
		};

		store.get = (file, cb) => {
			rfs.get(file, (err, data) => {
				//console.log("rfs3 hijacked", file);
				if (data) {
					return cb(err, data);
				}
				g(file, cb);
			});
		};
		return store;
	};
	__usable_environment.exports.lib.rfsmix = __usable_module.exports;
	return __usable_module.exports;
}
