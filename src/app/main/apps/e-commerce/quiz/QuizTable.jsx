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

export default function QuizTable() {
    const [quiz, setQuiz] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
		axios.get(baseURL + `/quiz`).then(response => {
			setIsLoading(false)
			setQuiz(response.data)
		})
       
    }, [])

    const columns = useMemo(
		() => [
			{
				accessorKey: 'Quiz Name',
				header: 'Quiz Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/quiz/management?id=${row.original.id}`}
						className="underline"
						color="secondary"
						role="button"
					>
						{row.original.title}
					</Typography>
				)
			},
            {
				accessorKey: 'Duration',
				header: 'Duration',
				Cell: ({ row }) => (
					<Typography					
						
						
					>
						{row.original.duration} minutes
					</Typography>
				)
			},
			{
				accessorKey: 'Course',
				header: 'Course',
				Cell: ({ row }) => (
					<Typography
					>
						{row.original.lesson?.courseModule?.course?.name == null ? 'N/A' : row.original.lesson?.courseModule?.course?.name}
					</Typography>
				)
			},
			{
				accessorKey: 'Lesson',
				header: 'Lesson',
				Cell: ({ row }) => (
					<Typography
					>
						{row.original.lesson == null ? 'N/A' : row.original.lesson.title}
					</Typography>
				)
			},
            {
				accessorKey: 'status',
				header: 'Status',
				accessorFn: (row) => {
					console.log(row)
					switch (row.status) {
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
				data={quiz}
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
