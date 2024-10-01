/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { APP_DATA } from '@/constants';
import { handleGetMe } from '@/services/auth';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
export interface IUserData {
	id: string;
	availableEnergy: number;
	balance: number;
	energyLimitLevel: number;
	energyLimitValue: number;
	firstName: string;
	isTelegramPremium: boolean;
	lastName: string;
	lastTapped: string;
	multiTapLevel: number;
	multiTapValue: number;
	rechargeSpeedLevel: number;
	rechargeSpeedValue: number;
	telegramId: string;
	telegramUsername: string;
	allowedInfinityTap: number;
	allowedFullEnergyRefill: number;
	infinityTapUsed: number;
	fullEnergyRefillUsed: number;
	userRank: string;
	haveTapBot?: boolean;
	tonBalance: number;
}

interface IUserContext {
	userData: IUserData | null;
	boostList: any | null;
	myTask: any | null;
	getMeInfo: () => Promise<void>;
}

const UserContext = createContext<IUserContext>({
	userData: null,
	boostList: null,
	myTask: null,
	getMeInfo: async () => {}
});

export const UserProvider = ({ children }: any) => {
	const [userData, setUserData] = useState<IUserData | null>(null);
	const [myTask, setMyTask] = useState<any>(null);
	const [boostList, setBoostList] = useState<any>(null);
	const location = useLocation();
	const getMeInfo = async () => {
		try {
			const response = await handleGetMe();
			const data: IUserData = get(response, 'data.data.user', null);
			setUserData(data);
			setBoostList(get(response, 'data.data.boostItems', []));
			setMyTask(get(response, 'data.data.myTasks', []));
			localStorage.setItem(APP_DATA, JSON.stringify(data));
		} catch (e) {
			console.log('2', e);
		}
	};

	useEffect(() => {
		if (
			location.pathname === '/tap' ||
			location.pathname === '/boost' ||
			location.pathname === '/task' ||
			location.pathname === '/tap/badge-detail'
		) {
			getMeInfo();
		}
	}, [location.pathname]);

	return (
		<UserContext.Provider value={{ userData, boostList, myTask, getMeInfo }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
