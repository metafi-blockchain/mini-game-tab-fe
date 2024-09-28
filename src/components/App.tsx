import { useIntegration } from '@telegram-apps/react-router-integration'
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator,
  parseThemeParams,
  postEvent,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport
} from '@telegram-apps/sdk-react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { type FC, useEffect, useMemo } from 'react'
import { Navigate, Route, Router, Routes } from 'react-router-dom'

import { routes } from '@/navigation/routes.tsx'

export const App: FC = () => {
  const lp = useLaunchParams()
  const miniApp = useMiniApp()
  const themeParams = useThemeParams()
  const viewport = useViewport()

  useEffect(() => {
    // const temp: any = { ...themeParams, headerBgColor: '#030617' };
    bindMiniAppCSSVars(miniApp, themeParams)
    postEvent('web_app_set_header_color', {
      color_key: 'bg_color',
      color: '#030617'
    })

    postEvent('web_app_expand')

    parseThemeParams({
      header_bg_color: '#030617'
    })
  }, [miniApp, themeParams])
  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams)
  }, [themeParams])

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport)
  }, [viewport])

  // Create a new application navigator and attach it to the browser history, so it could modify
  // it and listen to its changes.
  const navigator = useMemo(() => initNavigator('app-navigation-state'), [])
  const [location, reactNavigator] = useIntegration(navigator)

  // Don't forget to attach the navigator to allow it to control the BackButton state as well
  // as browser history.
  useEffect(() => {
    navigator.attach()
    return () => navigator.detach()
  }, [navigator])

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Router location={location} navigator={reactNavigator}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
    </AppRoot>
  )
}
