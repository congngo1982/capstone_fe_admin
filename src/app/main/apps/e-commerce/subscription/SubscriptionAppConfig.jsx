import { lazy } from 'react';

const Subscription = lazy(() => import('./Subscription'));

/**
 * The E-Commerce app configuration.
 */
const SubscriptionAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
            path: 'apps/subscriptions',
            element: <Subscription />,
        },
	]
};
export default SubscriptionAppConfig;
