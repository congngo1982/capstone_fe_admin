import { GlobalStyles } from '@mui/system';
import React from 'react'
import ModeratorHeader from './ModeratorHeader';
import ModeratorTable from './ModeratorTable';

export default function Moderator() {
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
				<ModeratorHeader />
				<ModeratorTable/>
			</div>
		</>
	);
}
