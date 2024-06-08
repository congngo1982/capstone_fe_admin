import { GlobalStyles } from '@mui/system';
import React from 'react'
import SubscriptionHeader from './SubscriptionHeader';
import SubscriptionTable from './SubscriptionTable';

export default function Subscription() {
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
				<SubscriptionHeader />
				<SubscriptionTable/>
			</div>
		</>
	);
}
