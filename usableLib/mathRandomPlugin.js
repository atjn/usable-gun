/**
 * @file
 * An attempt to make Math.random() more cryptographically safe.
 * This is a big improvement, but it is not a perfect substitute for proper cryptographic methods.
 * Adapted from https://github.com/DavidAnson/math-random-polyfill which also details some of the pros and cons of this approach.
 */

// Capture functions and values
const highShift = 2 ** 32;
const highMask = ( 2 ** (53 - 32) ) - 1;

/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive).
 * @returns {number} - A random number between 0 (inclusive) and 1 (exclusive).
 */
function mathRandomCrypto(){

	// Get random bits for numerator
	const array = new Uint32Array(2);
	crypto.getRandomValues(array);

	const numerator = ((array[0] & highMask) * highShift) + array[1];

	// Divide by maximum-value denominator
	const denominator = Number.MAX_SAFE_INTEGER + 1;

	return numerator / denominator;
}

export default function ({ library }){

	library.mathRandom = mathRandomCrypto;

}
