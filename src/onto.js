let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	/* BEGIN WRAPPED GUN CODE */ // On event emitter generic javascript utility.
	__usable_module.exports = function onto(tag, arg, as) {
		if (!tag) {
			return {
				to: onto,
			};
		}
		var hasCallbackFunction = "function" == typeof arg;

		var tag =
			(this.tag || (this.tag = {}))[tag] ||
			(hasCallbackFunction &&
				(this.tag[tag] = {
					tag,
					to: (onto._ = {
						next(arg) {
							var tmp;
							if ((tmp = this.to)) {
								tmp.next(arg);
							}
						},
					}),
				}));

		if (hasCallbackFunction) {
			var be = {
				off:
					onto.off ||
					(onto.off = function () {
						if (this.next === onto._.next) {
							return !0;
						}
						if (this === this.the.last) {
							this.the.last = this.back;
						}
						this.to.back = this.back;
						this.next = onto._.next;
						this.back.to = this.to;
						if (this.the.last === this.the) {
							delete this.on.tag[this.the.tag];
						}
					}),
				to: onto._,
				next: arg,
				the: tag,
				on: this,
				as,
			};
			(be.back = tag.last || tag).to = be;
			return (tag.last = be);
		}
		if ((tag = tag.to) && undefined !== arg) {
			tag.next(arg);
		}
		return tag;
	};
	__usable_environment.exports.gun.onto = __usable_module.exports;
	return __usable_module.exports;
}
