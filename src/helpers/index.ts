import { BigNumber } from 'bignumber.js';
export const formatNumberDownRound = (
	number: number | null | undefined,
	decimal = 3,
	suffixes = ''
) => {
	if (number === null || number === undefined) return 0;
	const bigValue = new BigNumber(number);
	const bigValueFormatted = bigValue.toFormat(decimal, BigNumber.ROUND_DOWN, {
		decimalSeparator: '.',
		groupSeparator: ',',
		groupSize: 3
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
};

export const minimizeAddress = (address: any, start = 7) => {
	if (!address) return 'N/A';
	if (address && address.length <= 14) return address;
	return `${address.slice(0, start)}...${address.slice(-start)}`;
};

export const convertRewardToRanking = (reward: number) => {
	if (reward <= 0 || reward > 10 * 10 ** 4) return '';
	const ranking = 11 - reward / 10 ** 4;
	if (ranking === 1) return '1st';
	if (ranking === 2) return '2nd';
	if (ranking === 3) return '3rd';
	return `${ranking}th`;
};
