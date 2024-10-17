// @ts-ignore
import Lottie from 'react-lottie';
import LoadingAnimation from '@/assets/animation/bouncing_ball.json';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleUserAuth } from '@/services/auth';
import { get } from 'lodash';
import { ACCESS_TOKEN, EXPIRE_TIME } from '@/constants';
import { useInitData, useLaunchParams } from '@tma.js/sdk-react';
import { useUser } from '@/contexts/UserContext';
let queryId =
	'query_id=AAH-c2R7AAAAAP5zZHufxuy0&user=%7B%22id%22%3A2070180862%2C%22first_name%22%3A%22Th%C3%A0nh%22%2C%22last_name%22%3A%22Nguy%E1%BB%85n%20Xu%C3%A2n%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1727887718&hash=72c2da49a461f83d5d4f94891d2a5e5d00b09832adb34405c2425b48cf775e99';
const OkLoadingPage = () => {
	const navigate = useNavigate();
	const initDataRaw = useLaunchParams().initDataRaw;
	const initData = useInitData();
	const getToken = async () => {
		try {
			if (initDataRaw && process.env.NODE_ENV === 'production') {
				queryId = initDataRaw;
			}
			const refId: any = initData?.startParam;
			const response = await handleUserAuth(queryId, refId || '');
			const token = get(response, 'data.data.token', '');
			const expireTime = get(response, 'data.data.expires', '');
			const isOnboard = get(response, 'data.data.airdropReceice', false);
			if (token && token !== '') {
				localStorage.setItem(ACCESS_TOKEN, `${token}`);
				localStorage.setItem(EXPIRE_TIME, `${expireTime}`);
				if (!isOnboard) {
					navigate('/onboard', { replace: true });
				} else {
					navigate('/tap', { replace: true });
				}
			}
		} catch (e) {
			console.log('error', e);
		}
	};

	useEffect(() => {
		getToken();
	}, []);

	return (
		<>
			{/* <HeaderPage rightText="Cancel" isShowIconLeft={false} /> */}
			<div className="flex-1">
				<Lottie
					options={{
						loop: true,
						autoplay: true,
						animationData: LoadingAnimation,
						rendererSettings: {
							preserveAspectRatio: 'xMidYMid slice'
						}
					}}
				/>
			</div>
		</>
	);
};
export default OkLoadingPage;
