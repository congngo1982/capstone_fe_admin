/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'app/shared-components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import axios from 'axios';
import { baseURL } from 'app/store/apiService';
import formatDate from 'app/theme-layouts/moment/moment';

export default function SubscriptionTable() {
    const [subscriptions, setSubscriptions] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
		const user = JSON.parse(localStorage.getItem('USER'));

		if (user.role === 'ORGANIZATION' || user.role === 'MENTOR') {
			axios.get(baseURL + `/subscription/mentor/${user.userId}/all`).then(response => {
				setIsLoading(false)
				setSubscriptions(response.data)
			})
		}
		else if (user.role === 'EMPLOYEE' || user.role === 'MANAGER') {
			axios.get(baseURL + "/subscription").then(response => {
				setIsLoading(false)
				setSubscriptions(response.data)
			})
		}
        
    }, [])

    const columns = useMemo(
		() => [
			{
				accessorKey: 'Organiztion',
				header: 'Organization',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						//to={`/apps/projects/management?id=${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.org.orgName}
					</Typography>
				)
			},
            {
				accessorKey: 'courseName',
				header: 'Course Name',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.coursePackage.course.name}
					</Typography>
				)
			},
            {
				accessorKey: 'name',
				header: 'Course Package Name',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.coursePackage.name}
					</Typography>
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

						case 'PAID':
							return (
								<Chip
									key={row.status}
									className="text-11"
									size="small"
									color="success"
									label={row.status}
								/>
							);

						case 'PAY_FAILED':
							return (
								<Chip
									key={row.status}
									className="text-11"
									size="small"
									color="error"
									label={row.status}
								/>
							);

                            case 'SYSTEM_FAILED':
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
			},
            {
				accessorKey: 'boughtPrice',
				header: 'Bought Price',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.boughtPrice}
					</Typography>
				)
			},
            {
				accessorKey: 'boughtMaxStudent',
				header: 'Bought Max Student',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.boughtMaxStudent}
					</Typography>
				)
			},
			{
				accessorKey: 'startDate',
				header: 'Bought Date',
				accessorFn: (row) => (
					<Chip
						key={row.startDate}
						className="text-11"
						size="small"
						color="default"
						label={formatDate(row?.startDate || new Date())}
					/>
				)
			}
		],
		[]
	);

    if (isLoading) {
        return (<FuseLoading/>);
    }

    return (
		<Paper
			className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
			elevation={0}
		>
			<DataTable
				data={subscriptions}
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
