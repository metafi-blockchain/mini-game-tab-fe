import './index.scss';
import OKButton from '@/components/Button';
interface IPropInput {
	value?: string | number;
	rootClass?: string;
	messageError?: string | null;
	type?: string;
	placeholder?: string;
	onChange?: (value: any) => void;
	isShowButtonRight?: boolean;
	isDisableButtonRight?: boolean;
	isDisabledInput?: boolean;
}
const OkInput = (props: IPropInput) => {
	const {
		isDisableButtonRight = false,
		isShowButtonRight = false,
		value,
		type, messageError = null,
		rootClass,
		placeholder = '',
		isDisabledInput = false,
		onChange
	} = props;
	const isError = messageError && (messageError !== '' || messageError !== null);
	return (
		<div>
			<div className={`flex flex-row min-h-[56px] relative item-input ${ isError && 'input-error'} ${rootClass} ${isDisabledInput ? 'disabled-input' : ''} items-center`}>
				<input disabled={isDisabledInput} className="input-custom h-full w-full" type={type} value={value} onChange={onChange && onChange} placeholder={placeholder} />
				{isShowButtonRight && (
					<OKButton text="Verify" isDisable={isDisableButtonRight} rootClass='h-8 flex items-center absolute top-[10px] right-2' />
				)}
			</div>
			{isError && (
				<p className="text-red-600 m-0">{messageError}</p>
			)}
		</div>

	)
}
export default OkInput;
