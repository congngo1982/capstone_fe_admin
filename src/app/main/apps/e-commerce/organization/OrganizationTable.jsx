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

export default function OrganizationTable() {
    const [organization, setOrganization] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(baseURL + "/organization").then(response => {
            setIsLoading(false)
            setOrganization(response.data)
        })
    }, [])

    const columns = useMemo(
		() => [
			{
				accessorKey: 'Organiztion',
				header: 'Organization Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						//to={`/apps/projects/management?id=${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.orgName}
					</Typography>
				)
			},
            {
				accessorKey: 'email',
				header: 'Email',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.user.email}
					</Typography>
				)
			},
            {
				accessorKey: 'status',
				header: 'Status',
				accessorFn: (row) => {
					switch (row.user.status) {
						case true:
							return (
								<Chip
									key="ACTIVE"
									className="text-11"
									size="small"
									color="success"
									label="ACTIVE"
								/>
							);

						case false:
							return (
								<Chip
									key="INACTIVE"
									className="text-11"
									size="small"
									color="warning"
									label="INACTIVE"
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
				accessorKey: 'createdDate',
				header: 'Created Date',
				accessorFn: (row) => (
					<Chip
						key={row.user.createdDate}
						className="text-11"
						size="small"
						color="default"
						label={formatDate(row?.user?.createdDate || new Date())}
					/>
				)
			},
            {
				accessorKey: 'modifiedDate',
				header: 'Modified Date',
				accessorFn: (row) => (
					<Chip
						key={row.user.modifiedDate}
						className="text-11"
						size="small"
						color="default"
						label={row.user.modifiedDate === null ? 'N/A' : formatDate(row?.user?.modifiedDate || new Date())}
					/>
				)
			},
			
           
            
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
				data={organization}
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
