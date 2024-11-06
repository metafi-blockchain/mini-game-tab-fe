import { ReactNode } from 'react';
import './index.scss';

interface IPropBaseButton {
	text?: string | ReactNode;
	isLoading?: boolean;
	isDisable?: boolean;
	rootClass?: string;
	handleOnClick?: () => void;
	children?: ReactNode;
	onClick?: any;
	style?: any;
}
const OKButton = (props: IPropBaseButton) => {
	const {
		text,
		isLoading,
		isDisable,
		rootClass = '',
		handleOnClick,
		style
	} = props;
	return (
		<>
			<button
				onClick={handleOnClick && handleOnClick}
				className={`button-base ${rootClass}`}
				disabled={isDisable || isLoading}
				style={{ ...style }}
			>
				<div className="flex flex-row gap-1 items-center justify-center">
					{isLoading && <div className="loader"></div>}
					<span className="text-white">{text}</span>
				</div>
			</button>
		</>
	);
};
export default OKButton;
