import WtButton from '../Button';
import WtModal from '../Modal';
import './index.scss';

type WtMessagePopupProps = {
	show?: boolean;
	title: string | JSX.Element;
	children: string | JSX.Element;
	button: string;
	onClickButton: () => void;
};
const WtMessagePopup = ({
	show,
	title,
	children,
	button,
	onClickButton
}: WtMessagePopupProps) => {
	return (
		<WtModal centered show={show}>
			<div className="wt-message-popup">
				<h3 className="wt-message-popup-title">{title}</h3>
				<div className="wt-message-popup-body">{children}</div>
				<WtButton onClick={onClickButton}>{button}</WtButton>
			</div>
		</WtModal>
	);
};
export default WtMessagePopup;
