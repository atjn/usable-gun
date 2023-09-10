let __usable_isActivated = false;
const __usable_module = {};
export default async function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	const __usable_process =
		__usable_environment.environmentHint !== "server"
			? undefined
			: "process" in globalThis
			? process
			: {
					env: {},
					uptime: () => {},
					cpuUsage: () => {},
					memoryUsage: () => {},
			  };

	/* BEGIN WRAPPED GUN CODE */

	await (async () => {
		var email;

		var fail = {
			send(opt, cb) {
				cb && cb("You do not have email installed.");
			},
		};

		if (!__usable_process.env.EMAIL) {
			return (__usable_module.exports = fail);
		}
		try {
			email = (await import("emailjs")).default;
		} catch (e) {}
		if (!email) {
			return (__usable_module.exports = fail);
		}
		return (__usable_module.exports = email.server.connect({
			user: __usable_process.env.EMAIL,
			password: __usable_process.env.EMAIL_KEY,
			host: __usable_process.env.EMAIL_HOST || "smtp.gmail.com",
			ssl: __usable_process.env.EMAIL_SSL || true,
		}));
	})();
	__usable_environment.exports.lib.email = __usable_module.exports;
	return __usable_module.exports;
}
