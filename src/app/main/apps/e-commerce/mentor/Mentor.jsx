import { GlobalStyles } from '@mui/system';
import React from 'react'
import MentorHeader from './MentorHeader';
import MentorTable from './MentorTable';

export default function Mentor() {
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
				<MentorHeader />
				<MentorTable/>
			</div>
		</>
	);
}
