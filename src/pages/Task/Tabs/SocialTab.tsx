import React from 'react';
import { LineItemSocial } from '../Component/LineItemTask';

type Props = {
	tasks: any[];
};

const SocialTab = ({ tasks = [] }: Props) => {
	return (
		<div className="flex flex-col h-[468px] space-y-2">
			<div className="flex-none font-semibold">Task list</div>
			<div className="space-y-4 flex-1 overflow-y-auto">
				{(tasks ?? []).map((item, index) => (
					<LineItemSocial key={`farming-key-${index}`} data={item} />
				))}
			</div>
		</div>
	);
};

export default SocialTab;
