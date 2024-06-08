import { lazy } from 'react';
import GroupManagement from './GroupManagement';
import GroupAllDetail from './GroupAllDetail';

const Group = lazy(() => import('./Group'));

/**
 * The E-Commerce app configuration.
 */
const GroupAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
            path: 'apps/groups',
            element: <Group />,
        },
        {
            path: 'apps/groups/management',
            element: <GroupManagement />,
        },
        {
            path: 'apps/groups/detail',
            element: <GroupAllDetail />,
        },
	]
};
export default GroupAppConfig;
