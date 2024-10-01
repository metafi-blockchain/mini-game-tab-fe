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
	'query_id=AAG77WkbAAAAALvtaRsfJuX8&user=%7B%22id%22%3A459926971%2C%22first_name%22%3A%22Shaky%22%2C%22last_name%22%3A%22James%22%2C%22username%22%3A%22jsmile1994%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1722932001&hash=857c33e878283ac3c848d04c19ae1604a52760da0db44726e946abb177b4a134';
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
			if (token && token !== '') {
				localStorage.setItem(ACCESS_TOKEN, `${token}`);
				localStorage.setItem(EXPIRE_TIME, `${expireTime}`);
				navigate('/tap', { replace: true });
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
