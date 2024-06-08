import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen/FuseSplashScreen';
import { resetUser, selectUser, selectUserRole, setUser, updateUser } from 'src/app/auth/user/store/userSlice';
import BrowserRouter from '@fuse/core/BrowserRouter';
import firebase from 'firebase/compat/app';
import _ from '@lodash';
//import useJwtAuth from './services/jwt/useJwtAuth';
import useFirebaseAuth from './services/firebase/useFirebaseAuth';
import UserModel from './user/models/UserModel';

const AuthContext = createContext({
	isAuthenticated: false
});

function AuthRouteProvider(props) {
	const { children } = props;
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	/**
	 * Get user role from store
	 */
	const userRole = useAppSelector(selectUserRole);
	/**
	 * Jwt auth service
	 */
	// const jwtService = useJwtAuth({
	// 	config: {
	// 		// tokenStorageKey: 'jwt_access_token',
	// 		signInUrl: 'mock-api/auth/sign-in',
	// 		signUpUrl: 'mock-api/auth/sign-up',
	// 		tokenRefreshUrl: 'mock-api/auth/refresh',
	// 		getUserUrl: 'mock-api/auth/user',
	// 		updateUserUrl: 'mock-api/auth/user',
	// 		updateTokenFromHeader: true
	// 	},
	// 	onSignedIn: (user) => {
	// 		dispatch(setUser(user));
	// 		setAuthService('jwt');
	// 	},
	// 	onSignedUp: (user) => {
	// 		dispatch(setUser(user));
	// 		setAuthService('jwt');
	// 	},
	// 	onSignedOut: () => {
	// 		dispatch(resetUser());
	// 		resetAuthService();
	// 	},
	// 	onUpdateUser: (user) => {
	// 		dispatch(updateUser(user));
	// 	},
	// 	onError: (error) => {
	// 		// eslint-disable-next-line no-console
	// 		console.warn(error);
	// 	}
	// });
	/**
	 * Firebase auth service
	 */
	// const firebaseService = useFirebaseAuth({
	// 	onSignedIn: (_user) => {
	// 		firebase
	// 			.database()
	// 			.ref(`users/${_user.uid}`)
	// 			.once('value')
	// 			.then((snapshot) => {
	// 				const user = snapshot.val();
	// 				dispatch(setUser(user));
	// 				setAuthService('firebase');
	// 			});
	// 	},
	// 	onSignedUp: (userCredential, displayName) => {
	// 		const _user = userCredential.user;
	// 		const user = UserModel({
	// 			uid: _user.uid,
	// 			role: ['admin'],
	// 			data: {
	// 				displayName,
	// 				email: _user.email
	// 			}
	// 		});
	// 		firebaseService.updateUser(user);
	// 		setAuthService('firebase');
	// 	},
	// 	onSignedOut: () => {
	// 		dispatch(resetUser());
	// 		resetAuthService();
	// 	},
	// 	onUpdateUser: (user) => {
	// 		dispatch(updateUser(user));
	// 	},
	// 	onError: (error) => {
	// 		// eslint-disable-next-line no-console
	// 		console.warn(error);
	// 	}
	// });
	/**
	 * Check if services is in loading state
	 */
	const isLoading = localStorage.getItem("USER") != null;
	/**
	 * Check if user is authenticated
	 */
	const isAuthenticated = localStorage.getItem("USER") != null;
	/**
	 * Combine auth services
	 */
	const combinedAuth = useMemo(
		() => {}
	);
	/**
	 * Get auth service
	 */
	const getAuthService = useCallback(() => {
		return localStorage.getItem('authService');
	}, []);
	/**
	 * Set auth service
	 */
	const setAuthService = useCallback((authService) => {
		if (authService) {
			localStorage.setItem('authService', authService);
		}
	}, []);
	/**
	 * Reset auth service
	 */
	const resetAuthService = useCallback(() => {
		localStorage.removeItem('authService');
	}, []);

	return (
		<AuthContext.Provider value={combinedAuth}>
			<BrowserRouter>
				<FuseAuthorization userRole={userRole}>{children}</FuseAuthorization>
			</BrowserRouter>
		</AuthContext.Provider>
	);
}

// function useAuth() {
// 	const context = useContext(AuthContext);

// 	if (!context) {
// 		throw new Error('useAuth must be used within a AuthRouteProvider');
// 	}

// 	return context;
// }

export { AuthRouteProvider };
