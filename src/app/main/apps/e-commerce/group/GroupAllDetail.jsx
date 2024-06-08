import { GlobalStyles } from '@mui/system';
import GroupHeader from './GroupHeader';
import GroupTableDetail from './GroupTableDetail';
import GroupDetail from './GroupDetail';

export default function GroupAllDetail() {
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
				<GroupHeader isCreate={true}/>
				<GroupDetail/>
			</div>
		</>
	);
}
