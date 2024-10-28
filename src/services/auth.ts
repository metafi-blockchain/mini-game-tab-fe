import { ENDPOINTS } from '@/constants/endpoint';
import axiosInstance from '@/utils/axios';

export const handleUserAuth = (telegramData: string, refId: string) => {
	return axiosInstance.post(ENDPOINTS.auth, { telegramData, refId });
};
export const handleGetMe = () => {
	return axiosInstance.get(ENDPOINTS.me);
};
export const getTxDepositStatus = (timestamp: string) => {
	return axiosInstance.get(`${ENDPOINTS.txStatus}?timestamp=${timestamp}`);
};
export const handleHarvest = () => {
	return axiosInstance.post(ENDPOINTS.harvest);
};
export const getAirdropPoint = () => {
	return axiosInstance.get(ENDPOINTS.getAirdrop);
};
export const confirmAirdropPoint = () => {
	return axiosInstance.post(ENDPOINTS.confirmAirdrop);
};
export const makeWithdrawRequest = (body: any) => {
	return axiosInstance.post(ENDPOINTS.withdrawRequest, body);
};
export const fetchListWithdrawRequest = (status: string) => {
	return axiosInstance.post(
		ENDPOINTS.listWithdrawRequest,
		status
			? {
					status: status
			  }
			: {
					isGetAll: true
			  }
	);
};
export const fetchUserListWithdrawRequest = () => {
	return axiosInstance.post(ENDPOINTS.listUserWithdrawRequest, {
		isGetAll: true
	});
};
