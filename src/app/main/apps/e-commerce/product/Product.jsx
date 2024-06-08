import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styled } from '@mui/material/styles';
import ProductHeader from './ProductHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import InventoryTab from './tabs/InventoryTab';
import PricingTab from './tabs/PricingTab';
import TasksApp from '../../tasks/TasksApp';
import { useGetECommerceProductQuery } from '../ECommerceApi';
import ProductModel from './models/ProductModel';
import { COURSE_EMPTY } from './models/Course';
import axios from 'axios';
import { baseURL } from 'app/store/apiService';
/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a product name').min(5, 'The product name must be at least 5 characters')
});

/**
 * The product page.
 */
function Product() {
	const Root = styled(FusePageSimple)(({ theme }) => ({
		'& .FusePageSimple-header': {
			backgroundColor: theme.palette.background.paper
		}
	}));
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { productId } = routeParams;
	const {
		data: product,
		isLoading,
		isError
	} = useGetECommerceProductQuery(productId, {
		skip: !productId || productId === 'new'
	});
	const [tabValue, setTabValue] = useState(0);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});
	const { reset, watch } = methods;
	const form = watch();
	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);
	useEffect(() => {
		if (product) {
			reset({ ...product });
		}
	}, [product, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	useEffect(() => {

		setRightSidebarOpen(Boolean(routeParams.productId));
	}, [routeParams]);

	// if (isLoading) {
	// 	return <FuseLoading />;
	// }

	const [course, setCourse] = useState(COURSE_EMPTY);
	const [isUpdate, setIsUpdate] = useState(null);

	useEffect(() => {
		if (routeParams["productId"] != 'new') {
			axios.get(baseURL + "/courses/" + routeParams["productId"])
			.then(response => {
				setCourse(response.data);
				setIsUpdate(true);
			})
		}
		else {
			setIsUpdate(false);
		}
		
	}, []);

	/**
	 * Show Message if the requested products is not exists
	 */
	if (isError && productId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such product!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/products"
					color="inherit"
				>
					Go to Products Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	// if (_.isEmpty(form) || (product && routeParams.productId !== product.id && routeParams.productId !== 'new')) {
	// 	return <FuseLoading />;
	// }

	if (isUpdate != null) {
		return (
			<FormProvider {...methods}>
				<FusePageCarded
					header={<ProductHeader course={course} />}
					content={
						<>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								indicatorColor="secondary"
								textColor="secondary"
								variant="scrollable"
								scrollButtons="auto"
								classes={{ root: 'w-full h-64 border-b-1' }}
							>
								<Tab
									className="h-64"
									label="Basic Info"
								/>
								{/* <Tab className="h-64" label="Course Images" /> */}
								<Tab
									className="h-64"
									label="Course Packages"
								/>
								{/* <Tab
									className="h-64"
									label="Students"
								/> */}
								<Tab
									className="h-64"
									label="Module"
								/>
							</Tabs>
							<div className="p-16 sm:p-24 max-w-9xl">
								<div className={tabValue !== 0 ? 'hidden' : ''}>
									<BasicInfoTab isUpdate={isUpdate} course={course} setCourse={setCourse} />
								</div>
	
								{/* <div className={tabValue !== 1 ? 'hidden' : ''}>
									<ProductImagesTab />
								</div> */}
	
								<div className={tabValue !== 1 ? 'hidden' : ''}>
									<PricingTab isUpdate={isUpdate} course={course} setCourse={setCourse}/>
								</div>
	
								{/* <div className={tabValue !== 2 ? 'hidden' : ''}>
									<InventoryTab />
								</div> */}
	
								<div className={tabValue !== 2 ? 'hidden' : ''}>
									<TasksApp isUpdate={isUpdate} course={course} setCourse={setCourse}/>
								</div>
							</div>
						</>
					}
					scroll={isMobile ? 'normal' : 'content'}
				/>
			</FormProvider>
		);
	}
	else {
		return (<FuseLoading/>)
	}
}

export default Product;
