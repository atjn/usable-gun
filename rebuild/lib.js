
/**
 *
 * @param string
 * @param start
 */
export function ensureStartsWith(string, start){
	if(typeof string !== "string") throw new TypeError(`Cannot manipulate string of type: ${typeof string}`);

	if(string.startsWith(start)){
		return string;
	}else{
		return `${start}${string}`;
	}
}

/**
 *
 * @param string
 * @param end
 */
export function ensureEndsWith(string, end){
	if(typeof string !== "string") throw new TypeError(`Cannot manipulate string of type: ${typeof string}`);

	if(string.endsWith(end)){
		return string;
	}else{
		return `${string}${end}`;
	}
}
