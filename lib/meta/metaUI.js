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
	const __usable_window =
		__usable_environment.environmentHint !== "browser"
			? undefined
			: new Proxy("window" in globalThis ? window : globalThis, {
					get(target, property) {
						if (["window", "globalThis", "global"].includes(property)) {
							return __usable_window;
						} else if (__usable_environment.library[property] !== undefined) {
							return __usable_environment.library[property];
						} else if ("window" in globalThis) {
							return window[property];
						} else {
							return undefined;
						}
					},
					set(object, property, value) {
						__usable_environment.library[property] = value;
						return true;
					},
			  });
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */

	/* UI */
	__usable_globalThis.meta.ui = {
		blink() {
			// hint visually that action has happened
			__usable_globalThis
				.$("#meta")
				.css("transition", "none")
				.css("background", "none");
			setTimeout(() => {
				__usable_globalThis.$("#meta")[0].style.transition = null;
				__usable_globalThis.$("#meta")[0].style.background = null;
			});
		},
		depth(n) {
			if (n) {
				__usable_globalThis
					.$("#meta")
					.css("background", "hsl(60, 100%," + (85 - n * 10) + "%)");
			} else {
				__usable_globalThis.$("#meta")[0].style.background = null;
			}
		},
	};
	var $m = __usable_globalThis.$("<div>").attr("id", "meta");
	//$m.append($('<span>').html('&#9776;').addClass('meta-start'));
	$m.append(__usable_globalThis.$("<span>").html("+").addClass("meta-start"));
	$m.append(
		__usable_globalThis
			.$("<div>")
			.addClass("meta-menu meta-none")
			.append("<ul>"),
	);
	$m.on("mouseenter", () => {
		if (
			__usable_globalThis.meta.flip.active ||
			__usable_globalThis.meta.flip.is()
		)
			return;
		__usable_globalThis.meta.flip();
	});
	$m.on("mouseleave", () => {
		if (
			__usable_globalThis.meta.flip.active ||
			!__usable_globalThis.meta.flip.is()
		)
			return;
		__usable_globalThis.meta.flip(false);
	});
	__usable_globalThis.$(__usable_window.document.body).append($m);
	__usable_globalThis.meta.ui.board = __usable_globalThis.$(".meta-menu", $m);
	css({
		"#meta": {
			display: "block",
			position: "fixed",
			bottom: "2em",
			right: "2em",
			"font-size": "18pt",
			"font-family": "Tahoma, arial",
			"border-radius": "1em",
			"text-align": "center",
			"z-index": 999999,
			margin: 0,
			padding: 0,
			width: "2em",
			height: "2em",
			outline: "none",
			overflow: "visible",
			background: "rgba(0,0,0,0.5)",
			color: "white",
			transition: "all 0.2s ease-in",
		},
		"#meta *": {
			outline: "none",
		},
		"#meta .meta-none": {
			display: "none",
		},
		"#meta span": {
			"line-height": "2em",
		},
		"#meta .meta-menu": {
			background: "rgba(0,0,0,0.2)",
			width: "12em",
			right: "-2em",
			bottom: "-2em",
			overflow: "visible",
			position: "absolute",
			"overflow-y": "scroll",
			"text-align": "right",
			"min-height": "20em",
			height: "100vh",
		},
		"#meta .meta-menu ul": {
			padding: 0,
			margin: "1em 1em 2em 0",
			"list-style-type": "none",
		},
		"#meta .meta-menu ul li": {
			display: "block",
			float: "right",
			padding: "0.5em 1em",
			"border-radius": "1em",
			"margin-left": "0.25em",
			"margin-top": "0.25em",
			background: "rgba(0,0,0,0.2)",
			"backdrop-filter": "blur(10px)",
			color: "white",
			cursor: "pointer",
		},
		"#meta .meta-menu ul li:hover": {
			background: "rgba(0,0,0,0.5)",
		},
		"#meta a": {
			color: "black",
		},
		"#meta:hover": {
			opacity: 1,
		},
		"#meta:hover .meta-menu": {
			display: "block",
		},
		"#meta .meta-menu ul:before": {
			content: "' '",
			display: "block",
			"min-height": "15em",
			height: "50vh",
		},
		"#meta .meta-start": {
			cursor: "pointer",
		},
	});
	function css(css) {
		var tmp = "";
		__usable_globalThis.$.each(css, (c, r) => {
			tmp += c + " {\n";
			__usable_globalThis.$.each(r, (k, v) => {
				tmp += "\t" + k + ": " + v + ";\n";
			});
			tmp += "}\n";
		});
		var tag = __usable_window.document.createElement("style");
		tag.innerHTML = tmp;
		$m.append(tag);
	}
	__usable_globalThis.meta.ui.iniline = (el, cssObj) => {
		for (var k in cssObj) {
			el.style[k] = cssObj[k];
		}
	};
}
