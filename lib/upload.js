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

	(() => {
		function upload(cb, opt) {
			var el = __usable_globalThis.$(this);
			cb = cb || (() => {});
			opt = __usable_globalThis.$.isPlainObject(opt)
				? opt
				: {
						input: opt,
				  };
			el.on("drop", (e) => {
				e.preventDefault();
				upload.drop(((e.originalEvent || e).dataTransfer || {}).files || [], 0);
			}).on("dragover", (e) => {
				e.preventDefault();
			});
			__usable_globalThis.$(opt.input || el).on("change", function (e) {
				if (!(e = (e.target || this || {}).files)) {
					return;
				}
				upload.drop(e, 0);
			});
			upload.drop = (files, i) => {
				if (
					opt.max &&
					(files[i].fileSize > opt.max || files[i].size > opt.max)
				) {
					cb(
						{
							err: "File size is too large.",
							file: __usable_globalThis.file[i],
						},
						upload,
					);
					if (files[++i]) {
						upload.drop(files, i);
					}
					return false;
				}
				var reader = new __usable_globalThis.FileReader();
				reader.onload = (e) => {
					cb(
						{
							file: files[i],
							event: e,
							id: i,
						},
						upload,
					);
					if (files[++i]) {
						upload.drop(files, i);
					}
				};
				if (files[i]) {
					reader.readAsDataURL(files[i]);
				}
			};
			return this;
		}
		upload.shrink = (e, cb, w, h) => {
			// via stackoverflow
			if (!e) {
				return (
					cb &&
					cb({
						err: "No file!",
					})
				);
			}
			if (e.err) {
				return;
			}
			var file = ((e.event || e).target || e).result || e;
			var img = new __usable_globalThis.Image();
			if (!((file || "").split(";")[0].indexOf("image") + 1)) {
				e.err = "Not an image!";
				return cb(e);
			}
			img.crossOrigin = "Anonymous";
			img.src = file;
			img.onload = () => {
				if (
					img.width < (w = w || 1000) &&
					img.height < (h || Infinity) &&
					"data:" == file.slice(0, 5)
				) {
					e.base64 = file;
					return cb(e || file);
				}
				if (!h) {
					h = img.height * (w / img.width);
				}
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				canvas.width = w;
				canvas.height = h;
				ctx.drawImage(img, 0, 0, w, h); // draw source image to canvas.
				var b64 = (e.base64 = canvas.toDataURL()); // base64 the shrunk image.
				cb((e.base64 && e) || b64);
			};
		};
		__usable_globalThis.$.fn.upload = upload;
	})();
}
