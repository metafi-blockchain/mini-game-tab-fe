import QRCode from 'react-qr-code';
import { config } from '@/config';
const OkQRCode = () => {
	return (
		<>
			<div className="body-page flex flex-col justify-start items-center gap-7 pt-[140px]">
				<h1 className="text-3xl m-0 text-white font-semibold text-center">
					Leave the desktop. Mobile gaming rocks!
				</h1>
				<div className="w-1/2 p-3 bg-white rounded-xl">
					<QRCode
						bgColor="#ffffff"
						size={256}
						style={{
							height: '100%',
							maxWidth: '100%',
							width: '100%',
							background: 'white'
						}}
						value={import.meta.env.VITE_TELE_LINK}
						viewBox={`0 0 256 256`}
					/>
				</div>
			</div>
		</>
	);
};
export default OkQRCode;
