import { GlobalStyles } from '@mui/system';
import React from 'react'
import GroupHeader from './GroupHeader';
import GroupTable from './GroupTable';

export default function Group() {
    return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full container flex flex-col">
				<GroupHeader isCreate={false}/>
				<GroupTable/>
			</div>
		</>
	);
}
