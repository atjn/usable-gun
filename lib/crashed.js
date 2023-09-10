import emailPlugin from "./email.js";
let __usable_isActivated = false;
export default async function (__usable_environment) {
	if (__usable_isActivated) return;
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
	const __usable_dirname =
		__usable_environment.environmentHint !== "server" ? undefined : "lib";

	/* BEGIN WRAPPED GUN CODE */

	await (async () => {
		try {
			var fs = (await import("node:fs")).default;
			var logs = [];
			var up = __usable_dirname + "/../";
			fs.readdir(up, (err, list) => {
				try {
					var i = 0;
					var f;
					while ((f = list[i++])) {
						if (0 === f.indexOf("isolate-") && ".log" === f.slice(-4)) {
							logs.push(f);
						}
					}
					logs = logs.sort();
					var i = 0;
					var f;
					var lf;
					while ((f = list[i++])) {
						if (0 <= f.indexOf("-v8-") && ".log" === f.slice(-4)) {
							lf = f;
						}
					}
					f = lf;
					if (!f) {
						return;
					}
					fs.rename(up + f, up + "v8.log", () => {
						var i = 0;
						var f;
						while ((f = logs[i++])) {
							fs.unlink(up + f, noop);
						}
						if (!__usable_process.env.EMAIL) {
							return;
						} // ONLY EMAIL IF DEVELOPER OPTS IN!!!
						email(); // ONLY EMAIL IF DEVELOPER OPTS IN!!!
					});
				} catch (e) {}
			});
			function noop() {}
			async function email() {
				try {
					if (!__usable_process.env.EMAIL) {
						return;
					} // ONLY EMAIL IF DEVELOPER OPTS IN!!!
					var address = __usable_process.env.EMAIL || "mark@gun.eco";
					// you also have to specify your EMAIL_KEY gmail 2F' app's password (not reg) to send out.
					await (
						await emailPlugin(__usable_environment)
					).send(
						{
							text: "log attached",
							from: address,
							to: address,
							subject: "GUN V8 LOG",
							attachment: [
								{
									path: up + "v8.log",
									type: "text/plain",
									name: "v8.log",
								},
							],
						},
						noop,
					);
				} catch (e) {}
			}
		} catch (e) {}
	})();
}
