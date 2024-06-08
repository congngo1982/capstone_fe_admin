/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDeleteECommerceProductsMutation, useGetECommerceProductsQuery } from '../ECommerceApi';

function ProductsTable() {
	const { data: products, isLoading, refetch } = useGetECommerceProductsQuery();
	useEffect(() => {
		refetch();
	  }, []);
	
	const [removeProducts] = useDeleteECommerceProductsMutation();
	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => row.imgUrl,
				id: 'id',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{/* {row.original?.images?.length > 0 && row.original.imgUrl ? ( */}
						<img
							className="w-full max-h-40 max-w-40 block rounded"
							src={row.original.imgUrl}
							alt={row.original.name}
							onError={(e) => {
								e.target.src = 'assets/images/apps/ecommerce/product-image-placeholder.png';
							}}
						/>
						{/* ) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row.original.name}
							/>
						)} */}
					</div>
				)
			},
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/e-commerce/products/${row.original.id}/${row.original.handle}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.name}
					</Typography>
				)
			},
			{
				accessorKey: 'age',
				header: 'Age',
				accessorFn: (row) => (
					<Chip
						key={row.age}
						className="text-11"
						size="small"
						color="default"
						label={row.age}
					/>
				)
			},
			{
				accessorKey: 'duration',
				header: 'Duration',
				accessorFn: (row) => (
					<Chip
						key={row.duration}
						className="text-11"
						size="small"
						color="info"
						label={row.duration}
					/>
				)
			},
			{
				accessorKey: 'status',
				header: 'Status',
				accessorFn: (row) => {
					switch (row.status) {
						case 'PENDING':
							return (
								<Chip
									key={row.status}
									className="text-11"
									size="small"
									color="warning"
									label={row.status}
								/>
							);

						case 'ACTIVE':
							return (
								<Chip
									key={row.status}
									className="text-11"
									size="small"
									color="success"
									label={row.status}
								/>
							);

						case 'INACTIVE':
							return (
								<Chip
									key={row.status}
									className="text-11"
									size="small"
									color="error"
									label={row.status}
								/>
							);

						default:
							return (
								<Chip
									key={row.status}
									className="text-11"
									size="small"
									color="default"
									label={row.status}
								/>
							);
					}
				}
			}
			// {
			// 	accessorKey: ['courseCoursePackages', 'maxStudent'],
			// 	header: 'Max Student',
			// 	accessorFn: (row) => `$${row.maxStudent}`
			// },
			// {
			// 	accessorKey: ['courseCoursePackages', 'price'],
			// 	header: 'Quantity',
			// 	accessorFn: (row) => (
			// 		<div className="flex items-center space-x-8">
			// 			<span>{row.quantity}</span>
			// 			<i
			// 				className={clsx(
			// 					'inline-block w-8 h-8 rounded',
			// 					row.quantity <= 5 && 'bg-red',
			// 					row.quantity > 5 && row.quantity <= 25 && 'bg-orange',
			// 					row.quantity > 25 && 'bg-green'
			// 				)}
			// 			/>
			// 		</div>
			// 	)
			// },
			// {
			// 	accessorKey: 'active',
			// 	header: 'Active',
			// 	accessorFn: (row) => (
			// 		<div className="flex items-center">
			// 			{row.active ? (
			// 				<FuseSvgIcon
			// 					className="text-green"
			// 					size={20}
			// 				>
			// 					heroicons-outline:check-circle
			// 				</FuseSvgIcon>
			// 			) : (
			// 				<FuseSvgIcon
			// 					className="text-red"
			// 					size={20}
			// 				>
			// 					heroicons-outline:minus-circle
			// 				</FuseSvgIcon>
			// 			)}
			// 		</div>
			// 	)
			// }
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				data={products}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							removeProducts([row.original.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								removeProducts(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
							color="secondary"
						>
							<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							<span className="hidden sm:flex mx-8">Delete selected items</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default ProductsTable;
