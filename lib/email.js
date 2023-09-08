let __usable_isActivated = false;
const __usable_module = {};
export default async function (__usable_environment) {
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
	await (async () => {
		var email;

		var fail = {
			send(opt, cb) {
				cb && cb("You do not have email installed.");
			},
		};

		if (!__usable_globalThis.process.env.EMAIL) {
			return (__usable_module.exports = fail);
		}
		try {
			email = (await import("emailjs")).default;
		} catch (e) {}
		if (!email) {
			return (__usable_module.exports = fail);
		}
		return (__usable_module.exports = email.server.connect({
			user: __usable_globalThis.process.env.EMAIL,
			password: __usable_globalThis.process.env.EMAIL_KEY,
			host: __usable_globalThis.process.env.EMAIL_HOST || "smtp.gmail.com",
			ssl: __usable_globalThis.process.env.EMAIL_SSL || true,
		}));
	})();
	__usable_environment.exports.lib.email = __usable_module.exports;
	return __usable_module.exports;
}
