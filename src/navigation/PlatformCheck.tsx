import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaunchParams } from '@tma.js/sdk-react';

const PlatformCheck = () => {
	const lp = useLaunchParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (
			!['android', 'ios', 'android_x'].includes(lp.platform) &&
			process.env.NODE_ENV === 'production'
		) {
			navigate('/qr-redirect', { replace: true });
		}
	}, [lp.platform, navigate]);

	return null;
};

export default PlatformCheck;
