import { useIntegration } from '@tma.js/react-router-integration';
import {
	bindMiniAppCSSVars,
	bindThemeParamsCSSVars,
	bindViewportCSSVars,
	initNavigator,
	useLaunchParams,
	useMiniApp,
	useThemeParams,
	useViewport,
	postEvent,
	parseThemeParams
} from '@tma.js/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useMemo } from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { routes } from '@/navigation/routes.tsx';
import OkPrivateRoute from '@/navigation/PrivateRoute';
import OkLoadingPage from '@/pages/Loading';
import OkQRCode from '@/pages/QRCode';
import { UserProvider } from '@/contexts/UserContext';
import { Provider } from 'react-redux';
import store from '@/store';
import PlatformCheck from '@/navigation/PlatformCheck';
import Onboard from '@/pages/Onboard';
import OnboardSteps from '@/pages/Onboard/Component/OnboardSteps';

export const App: FC = () => {
	const lp = useLaunchParams();
	const miniApp = useMiniApp();
	const themeParams = useThemeParams();
	const viewport = useViewport();

	useEffect(() => {
		// const temp: any = { ...themeParams, headerBgColor: '#030617' };
		bindMiniAppCSSVars(miniApp, themeParams);
		postEvent('web_app_set_header_color', {
			color_key: 'bg_color',
			color: '#030617'
		});

		postEvent('web_app_expand');

		parseThemeParams({
			header_bg_color: '#030617'
		});
	}, [miniApp, themeParams]);
	useEffect(() => {
		return bindThemeParamsCSSVars(themeParams);
	}, [themeParams]);

	useEffect(() => {
		return viewport && bindViewportCSSVars(viewport);
	}, [viewport]);

	// Create new application navigator and attach it to the browser history, so it could modify
	// it and listen to its changes.
	const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
	const [location, reactNavigator] = useIntegration(navigator);

	// Don't forget to attach the navigator to allow it to control the BackButton state as well
	// as browser history.
	useEffect(() => {
		navigator.attach();
		return () => navigator.detach();
	}, [navigator]);

	return (
		<Provider store={store}>
			<ToastContainer autoClose={4000} closeOnClick={true} />
			<Router location={location} navigator={reactNavigator}>
				<UserProvider>
					<PlatformCheck />
					<AppRoot
						className="wt-app"
						// appearance={miniApp.isDark ? 'dark' : 'light'}
						appearance={'dark'}
						platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
					>
						<Routes>
							<Route path="/" element={<OkLoadingPage />} />
							<Route path="/onboard" element={<Onboard />} />
							<Route path="/onboard/steps" element={<OnboardSteps />} />
							<Route path="/qr-redirect" element={<OkQRCode />} />
							<Route element={<OkPrivateRoute />}>
								{routes.map(route => (
									<Route key={route.path} {...route} />
								))}
							</Route>
						</Routes>
					</AppRoot>
				</UserProvider>
			</Router>
		</Provider>
	);
};
