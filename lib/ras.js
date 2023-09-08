let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	(() => {
		/**
    Radix AsyncStorage adapter
    make sure to pass AsyncStorage instance in opt.AsyncStorage
    example:
    import AsyncStorage from 'react-native'
    const store = Store({AsyncStorage})
    const gun = new Gun({store,peers:[...]})
    **/

		__usable_module.exports = (opt) => {
			opt = opt || {};
			const store = () => {};
			const as = opt.AsyncStorage;
			store.put = (key, data, cb) => {
				as.setItem("" + key, data)
					.then(() => cb(null, 1))
					.then(() => __usable_globalThis.debug.log("ok put"))
					.catch(() => {
						__usable_globalThis.debug.error(`failed saving to asyncstorage`, {
							key,
							data,
						});
						cb(null, 0);
					});
			};
			store.get = (key, cb) => {
				as.getItem("" + key)
					.then((data) => cb(null, data))
					.then(() => __usable_globalThis.debug.log("ok get"))
					.catch(() => {
						__usable_globalThis.debug.error(
							`failed fetching from asyncstorage`,
							{
								key,
							},
						);
						cb(null, 0);
					});
			};
			return store;
		};
	})();
	__usable_environment.exports.lib.ras = __usable_module.exports;
	return __usable_module.exports;
}
