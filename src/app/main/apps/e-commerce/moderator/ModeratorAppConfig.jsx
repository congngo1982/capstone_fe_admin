import { lazy } from 'react';

const Moderator = lazy(() => import('./Moderator'));

/**
 * The E-Commerce app configuration.
 */
const ModeratorAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
            path: 'apps/employee',
            element: <Moderator />,
        },
	]
};
export default ModeratorAppConfig;
