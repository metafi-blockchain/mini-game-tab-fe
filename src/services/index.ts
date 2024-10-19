import { ENDPOINTS } from '@/constants/endpoint';
import axiosInstance from '@/utils/axios';
import { beginCell, toNano, Address } from '@ton/ton';
import { CHAIN } from '@tonconnect/ui-react';
import BigNumber from 'bignumber.js';

export const handleTap = (countTap: number, startTime: string) => {
	return axiosInstance.post(
		`${ENDPOINTS.tap}?value=${countTap}&startTime=${startTime}`
	);
};
export const handleGetBoost = () => {
	return axiosInstance.get(`${ENDPOINTS.boostList}`);
};
export const handleBoost = (type: number) => {
	return axiosInstance.post(`${ENDPOINTS.boost}/${type}`);
};
export const handleGetMyTask = () => {
	return axiosInstance.get(ENDPOINTS.myTasks);
};
export const handleFinishTask = ({
	taskId,
	code
}: {
	taskId: string;
	code?: string;
}) => {
	return axiosInstance.post(ENDPOINTS.completeTask, {
		taskId,
		code: code ? code : ''
	});
};
export const handleGetListFriends = () => {
	return axiosInstance.get(ENDPOINTS.refererList);
};
export const handleEnergyRefill = () => {
	return axiosInstance.post(ENDPOINTS.energyRefill);
};
export const handleInfinityTap = (value: number) => {
	return axiosInstance.post(`${ENDPOINTS.infinityTap}?value=${value}`);
};
export const handleGetStatistic = () => {
	return axiosInstance.get(`${ENDPOINTS.statistic}`);
};
export const handleGetClaimTapBot = () => {
	return axiosInstance.get(`${ENDPOINTS.tapbotClaim}`);
};

export const makeTx = (teleId: string, tonAmount: number) => {
	const body = beginCell().storeUint(0, 32).storeStringTail(teleId).endCell();

	const depositFee = parseFloat('0.1'); // TON
	const tx = {
		validUntil: Math.floor(Date.now() / 1000) + 360,
		// network: CHAIN.MAINNET,
		messages: [
			{
				address: Address.parse(import.meta.env.VITE_DEPOSIT_WALLET).toString(),
				amount: toNano(tonAmount + depositFee).toString(),
				payload: body.toBoc().toString('base64')
			}
		]
	};

	return tx;
};

export interface IWithdrawItem {
	telegramId: string;
	amount: number;
	address: string;
}

export const makeCommissionTx = (data: IWithdrawItem[]) => {
	let listMsg: any = [];
	const depositFee = parseFloat('0.05'); // TON
	data.forEach((item: IWithdrawItem) => {
		const body = beginCell()
			.storeUint(0, 32)
			.storeStringTail(item.telegramId)
			.endCell();
		listMsg.push({
			address: item.address,
			amount: toNano(
				new BigNumber(item.amount).dividedBy(10 ** 9).toNumber() + depositFee
			).toString(),
			payload: body.toBoc().toString('base64')
		});
	});

	console.log('listMsg', listMsg);

	const tx = {
		validUntil: Math.floor(Date.now() / 1000) + 360,
		// network: CHAIN.MAINNET,
		messages: listMsg
	};

	return tx;
};
