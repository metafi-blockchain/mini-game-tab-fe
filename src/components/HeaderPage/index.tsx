import { useNavigate } from 'react-router-dom';

interface IPropHeader {
	rightText?: string;
	isShowIconLeft?: boolean;
}
const HeaderPage = ({
	rightText = 'Back',
	isShowIconLeft = true
}: IPropHeader) => {
	const navigate = useNavigate();
	return (
		<div className="header-page">
			<div className="left-header">
				{isShowIconLeft && (
					<img
						onClick={() => navigate(-1)}
						src="/images/icons/arrow-left.svg"
						alt="icon-arrow-left"
					/>
				)}
				<span>{rightText}</span>
			</div>
			<div className="middle-header">ETERNAL KINGDOMS Coin</div>
			<div className="right-header">
				<img src="/images/icons/trailing.svg" alt="icon-trailing" />
			</div>
		</div>
	);
};
export default HeaderPage;
