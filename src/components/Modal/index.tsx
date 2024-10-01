import React, { ReactNode } from 'react';
import './index.scss'
type positionModal = 'center' | 'end' | 'start';
interface IModalProps {
	isOpen?: boolean;
	setIsOpen?: (value: boolean) => void;
	renderBody?: ReactNode;
	children?: ReactNode;
	centered?: boolean;
	show?: boolean;
	position?: positionModal;
	noStyle?: boolean;
	rootClassname?: string;
}

const OkModal = (props: IModalProps) => {
	const { isOpen, setIsOpen, renderBody, position = 'center', noStyle = false, rootClassname = '' } = props;
	return (
		<div>
			{isOpen && (
				<div
					className={`fixed inset-0 z-[80] flex items-${position} justify-${position} bg-black bg-opacity-50 transition-opacity duration-500 ease-out ${
						isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
					}`}
				>
					<div
						className={`transform transition-all duration-500 ${
							isOpen ? 'slide-up-animation' : 'slide-down-animation'
						} sm:max-w-lg w-full `}
					>
						<div className={`${noStyle ? '' : 'modal-content sm:mx-auto m-4'} ${rootClassname && rootClassname}`}>
							<div className="flex justify-end">
								<img onClick={() => setIsOpen && setIsOpen(false)} src="/images/icons/close.svg" alt="icon-close" />
							</div>
							{renderBody && renderBody}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OkModal;
