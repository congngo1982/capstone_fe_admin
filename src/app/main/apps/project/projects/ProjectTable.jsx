/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useMemo } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { useDeleteECommerceProjectMutation, useGetECommerceProjectsQuery } from '../ProjectApi';

function ProjectTable() {
	const { data:projects, isLoading, refetch } = useGetECommerceProjectsQuery();

	useEffect(() => {
		refetch();
	  }, []);

	const [removeProject] = useDeleteECommerceProjectMutation();
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
						{row.original?.images?.length > 0 && row.original.imgUrl ? (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src={_.find(row.original.images, { id: row.original.imgUrl })?.url}
								alt={row.original.goal}
							/>
						) : (
							<img
								className="w-full max-h-40 max-w-40 block rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={row.original.goal}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'goal',
				header: 'Goal',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/projects/management?id=${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.goal}
					</Typography>
				)
			},
			{
				accessorKey: 'skill',
				header: 'Skill',
				accessorFn: (row) => (
					<Chip
						key={row.skill}
						className="text-11"
						size="small"
						color="default"
						label={row.skill}
					/>
				)
			},
			{
				accessorKey: 'introVideoUrl',
				header: 'Intro URL',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.introVideoUrl}
					</Typography>
				)
			},
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
			{
				accessorKey: 'status',
				header: 'Active',
				accessorFn: (row) => (
					<div className="flex items-center">
						{row.status === 'ACTIVE' ? (
							<FuseSvgIcon
								className="text-green"
								size={20}
							>
								heroicons-outline:check-circle
							</FuseSvgIcon>
						) : (
							<FuseSvgIcon
								className="text-red"
								size={20}
							>
								heroicons-outline:minus-circle
							</FuseSvgIcon>
						)}
					</div>
				)
			}
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
				data={projects}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							removeProject([row.original.id]);
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
								removeProject(selectedRows.map((row) => row.original.id));
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

export default ProjectTable;
