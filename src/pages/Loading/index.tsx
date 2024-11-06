// @ts-ignore
import Lottie from 'react-lottie';
import LoadingAnimation from '@/assets/animation/loading.json';
import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGetMe, handleUserAuth } from '@/services/auth';
import { get } from 'lodash';
import { ACCESS_TOKEN, EXPIRE_TIME } from '@/constants';
import { useInitData, useLaunchParams } from '@tma.js/sdk-react';
import { IUserData, useUser } from '@/contexts/UserContext';
let queryId =
	'query_id=AAG77WkbAAAAALvtaRv79YgW&user=%7B%22id%22%3A459926971%2C%22first_name%22%3A%22Shaky%22%2C%22last_name%22%3A%22James%22%2C%22username%22%3A%22jsmile1994%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1730132209&hash=b0dbdcd0592aeb96be18514af554b45cf91f70469b56b31983e788fbf42b8f76';
const OkLoadingPage = () => {
	const navigate = useNavigate();
	const initDataRaw = useLaunchParams().initDataRaw;
	const initData = useInitData();
	const getToken = async () => {
		try {
			console.log('1111');
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
				const response = await handleGetMe();
				const data: IUserData = get(response, 'data.data.user', null);
				if (data) {
					if (data.isReceiveAirdrop) {
						navigate('/tap', { replace: true });
					} else {
						navigate('/onboard', { replace: true });
					}
				} else {
					navigate('/onboard', { replace: true });
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
		<Fragment>
			<div className="body-page">
				<div className="content-page h-full jusify-between pt-6 px-4 gap-4 space-y-6">
					<div className="flex flex-col justify-between items-center gap-6 h-full">
						<div className="flex-1 flex flex-col justify-center items-center gap-6">
							<img
								src="/images/icons/logo.svg"
								width={313}
								height={93}
								alt="logo-eternal-kingdoms"
							/>
							<div className="text-center font-medium">
								<Lottie
									width={120}
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
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};
export default OkLoadingPage;
