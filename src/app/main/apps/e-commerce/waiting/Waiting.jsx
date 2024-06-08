import { GlobalStyles } from '@mui/system';
import WaitingHeader from './WaitingHeader';
import WaitingTable from './WaitingTable';

export default function Waiting() {
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
				<WaitingHeader />
				<WaitingTable/>
			</div>
		</>
	);
}
