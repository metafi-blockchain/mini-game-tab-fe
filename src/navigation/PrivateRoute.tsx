import { PropsWithChildren } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { ACCESS_TOKEN, EXPIRE_TIME } from '@/constants';
const OkPrivateRoute = ({ children }: PropsWithChildren) => {
	const location = useLocation();
	const checkExpiredTime = () => {
		const expireTime = localStorage.getItem(EXPIRE_TIME);
		if (!expireTime || expireTime === '') return true;
		const givenDate = new Date(expireTime);
		const now = new Date();
		return givenDate < now;
	};

	const token = localStorage.getItem(ACCESS_TOKEN);
	if (!token || checkExpiredTime()) {
		return <Navigate to="/loading" state={{ from: location }} />;
	}

	return children ? children : <Outlet />;
};

export default OkPrivateRoute;
