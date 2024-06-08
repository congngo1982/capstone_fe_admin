import { lazy } from 'react';

const Waiting = lazy(() => import('./Waiting'));

/**
 * The E-Commerce app configuration.
 */
const WaitingAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
            path: 'apps/waiting',
            element: <Waiting />,
        },
	]
};
export default WaitingAppConfig;
