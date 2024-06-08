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

export default function GroupTableDetail() {
    const [group, setGroup] = useState([])
    const [isLoading, setIsLoading] = useState(true);

	const urlParams = new URLSearchParams(window.location.search);
  	const groupId = urlParams.get('id');

    useEffect(() => {
		setIsLoading(true);
		if (groupId == null) {
			return;
		}
		
		axios.get(baseURL + `/group/full/${groupId}`).then(response => {
			setIsLoading(false)
			setGroup(response.data)
		})       
    }, [])

    const columns = useMemo(
		() => [
			{
				accessorKey: 'Group Name',
				header: 'Group Name',
				Cell: ({ row }) => (
					<Typography
					>
						{row.original.name}
					</Typography>
				)
			},
            {
				accessorKey: 'courseName',
				header: 'Course Name',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.subscription.coursePackage.course.name}
					</Typography>
				)
			},
            {
				accessorKey: 'name',
				header: 'Course Package Name',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.subscription.coursePackage.name}
					</Typography>
				)
			},
			{
				accessorKey: 'Students',
				header: 'Students',
				Cell: ({ row }) => (
					<Typography
					>
						{row.original.studentExist}
					</Typography>
				)
			},
            {
				accessorKey: 'status',
				header: 'Status',
				accessorFn: (row) => {
					console.log(row)
					switch (row.status) {
						case 'TEXT':
							return (
								<Chip
									key={row.status}
									className="text-11"
									size="small"
									color="warning"
									label={row.status}
								/>
							);

						case 'NEW':
							return (
								<Chip
									key={row.status}
									className="text-11"
									size="small"
									color="success"
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
									label="N/A"
								/>
							);
					}
				}
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
				data={group}
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
