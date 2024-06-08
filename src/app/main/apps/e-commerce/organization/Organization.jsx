import { GlobalStyles } from '@mui/system';
import React from 'react'
import OrganizationHeader from './OrganizationHeader';
import OrganizationTable from './OrganizationTable';

export default function Organization() {
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
				<OrganizationHeader />
				<OrganizationTable/>
			</div>
		</>
	);
}
