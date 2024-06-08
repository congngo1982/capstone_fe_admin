import { apiService as api } from 'app/store/apiService';
import ProjectModel from '../project/Models/ProjectModels';
import { baseURL } from 'app/store/apiService';
export const addTagTypes = ['eCommerce_projects', 'eCommerce_Project', 'eCommerce_orders', 'eCommerce_order'];
const ECommerceApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getECommerceProjects: build.query({
				query: () => ({ url: `${baseURL}/projects` }),
				providesTags: ['eCommerce_projects']
			}),
			deleteECommerceProjects: build.mutation({
				query: (ProjectIds) => ({
					url: `/mock-api/ecommerce/Projects`,
					method: 'DELETE',
					data: ProjectIds
				}),
				invalidatesTags: ['eCommerce_Projects']
			}),
			getECommerceProject: build.query({
				query: (ProjectId) => ({
					url: `/mock-api/ecommerce/Projects/${ProjectId}`
				}),
				providesTags: ['eCommerce_Project', 'eCommerce_Projects']
			}),
			createECommerceProject: build.mutation({
				query: (newProject) => ({
					url: `/mock-api/ecommerce/Projects`,
					method: 'POST',
					data: ProjectModel(newProject)
				}),
				invalidatesTags: ['eCommerce_Projects', 'eCommerce_Project']
			}),
			updateECommerceProject: build.mutation({
				query: (Project) => ({
					url: `/mock-api/ecommerce/Projects/${Project.id}`,
					method: 'PUT',
					data: Project
				}),
				invalidatesTags: ['eCommerce_Project', 'eCommerce_Projects']
			}),
			deleteECommerceProject: build.mutation({
				query: (ProjectId) => ({
					url: `/mock-api/ecommerce/Projects/${ProjectId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['eCommerce_Project', 'eCommerce_Projects']
			}),
			getECommerceOrders: build.query({
				query: () => ({ url: `/mock-api/ecommerce/orders` }),
				providesTags: ['eCommerce_orders']
			}),
			getECommerceOrder: build.query({
				query: (orderId) => ({ url: `/mock-api/ecommerce/orders/${orderId}` }),
				providesTags: ['eCommerce_order']
			}),
			updateECommerceOrder: build.mutation({
				query: (order) => ({
					url: `/mock-api/ecommerce/orders/${order.id}`,
					method: 'PUT',
					data: order
				}),
				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
			}),
			deleteECommerceOrder: build.mutation({
				query: (orderId) => ({
					url: `/mock-api/ecommerce/orders/${orderId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
			}),
			deleteECommerceOrders: build.mutation({
				query: (ordersId) => ({
					url: `/mock-api/ecommerce/orders`,
					method: 'DELETE',
					data: ordersId
				}),
				invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
			})
		}),
		overrideExisting: false
	});
export default ECommerceApi;
export const {
	useGetECommerceProjectsQuery,
	useDeleteECommerceProjectsMutation,
	useGetECommerceProjectQuery,
	useUpdateECommerceProjectMutation,
	useDeleteECommerceProjectMutation,
	useGetECommerceOrdersQuery,
	useGetECommerceOrderQuery,
	useUpdateECommerceOrderMutation,
	useDeleteECommerceOrderMutation,
	useDeleteECommerceOrdersMutation,
	useCreateECommerceProjectMutation
} = ECommerceApi;
