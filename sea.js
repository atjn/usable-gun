import seaRootPlugin from "./sea/root.js";
import seaHttpsPlugin from "./sea/https.js";
import seaArrayPlugin from "./sea/array.js";
import seaBufferPlugin from "./sea/buffer.js";
import seaShimPlugin from "./sea/shim.js";
import seaSettingsPlugin from "./sea/settings.js";
import seaSha256Plugin from "./sea/sha256.js";
import seaSha1Plugin from "./sea/sha1.js";
import seaWorkPlugin from "./sea/work.js";
import seaPairPlugin from "./sea/pair.js";
import seaSignPlugin from "./sea/sign.js";
import seaVerifyPlugin from "./sea/verify.js";
import seaAeskeyPlugin from "./sea/aeskey.js";
import seaEncryptPlugin from "./sea/encrypt.js";
import seaDecryptPlugin from "./sea/decrypt.js";
import seaSecretPlugin from "./sea/secret.js";
import seaCertifyPlugin from "./sea/certify.js";
import seaSeaPlugin from "./sea/sea.js";
import seaUserPlugin from "./sea/user.js";
import seaThenPlugin from "./sea/then.js";
import seaCreatePlugin from "./sea/create.js";
import seaAuthPlugin from "./sea/auth.js";
import seaRecallPlugin from "./sea/recall.js";
import seaSharePlugin from "./sea/share.js";
import seaIndexPlugin from "./sea/index.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;

	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	(() => {
		const __usable_MODULE = {};
		seaRootPlugin(__usable_environment, __usable_MODULE);
		seaHttpsPlugin(__usable_environment, __usable_MODULE);
		seaArrayPlugin(__usable_environment, __usable_MODULE);
		seaBufferPlugin(__usable_environment, __usable_MODULE);
		seaShimPlugin(__usable_environment, __usable_MODULE);
		seaSettingsPlugin(__usable_environment, __usable_MODULE);
		seaSha256Plugin(__usable_environment, __usable_MODULE);
		seaSha1Plugin(__usable_environment, __usable_MODULE);
		seaWorkPlugin(__usable_environment, __usable_MODULE);
		seaPairPlugin(__usable_environment, __usable_MODULE);
		seaSignPlugin(__usable_environment, __usable_MODULE);
		seaVerifyPlugin(__usable_environment, __usable_MODULE);
		seaAeskeyPlugin(__usable_environment, __usable_MODULE);
		seaEncryptPlugin(__usable_environment, __usable_MODULE);
		seaDecryptPlugin(__usable_environment, __usable_MODULE);
		seaSecretPlugin(__usable_environment, __usable_MODULE);
		seaCertifyPlugin(__usable_environment, __usable_MODULE);
		seaSeaPlugin(__usable_environment, __usable_MODULE);
		seaUserPlugin(__usable_environment, __usable_MODULE);
		seaThenPlugin(__usable_environment, __usable_MODULE);
		seaCreatePlugin(__usable_environment, __usable_MODULE);
		seaAuthPlugin(__usable_environment, __usable_MODULE);
		seaRecallPlugin(__usable_environment, __usable_MODULE);
		seaSharePlugin(__usable_environment, __usable_MODULE);
		seaIndexPlugin(__usable_environment, __usable_MODULE);
		__usable_module.exports = __usable_MODULE.exports;
	})();
	__usable_environment.exports.default.sea = __usable_module.exports;
	return __usable_module.exports;
}
