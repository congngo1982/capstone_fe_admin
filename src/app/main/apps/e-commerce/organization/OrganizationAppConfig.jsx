import { lazy } from 'react';

const Organization = lazy(() => import('./Organization'));

/**
 * The E-Commerce app configuration.
 */
const OrganizationAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
            path: 'apps/organizations',
            element: <Organization />,
        },
	]
};
export default OrganizationAppConfig;
