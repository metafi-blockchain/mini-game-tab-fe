import { BigNumber } from 'bignumber.js';
export const formatNumberDownRound = (number: number | null | undefined, decimal = 3, suffixes = '') => {
	if (number === null || number === undefined) return 0;
	const bigValue = new BigNumber(number);
	const bigValueFormatted = bigValue.toFormat(decimal, BigNumber.ROUND_DOWN, {
		decimalSeparator: '.',
		groupSeparator: ',',
		groupSize: 3,
	});
	if (bigValueFormatted === 'NaN') {
		return `0 ${suffixes}`;
	}
	// remove zero and dot in decimal part (ex: 1,111.00 => 1,111)
	const valueConcated = bigValueFormatted.replace(/\.?0+$/, '');

	return `${valueConcated} ${suffixes}`;
};

export const storeLocalStorage = (key: string, data: Object) => {
	localStorage.setItem(key, JSON.stringify(data));
}
