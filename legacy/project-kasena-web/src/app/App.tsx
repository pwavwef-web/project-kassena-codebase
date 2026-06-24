import { RouterProvider } from 'react-router-dom'
import { SplashScreen } from '../components/common/SplashScreen'
import { router } from './routes'

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <SplashScreen />
    </>
  )
}

export default App
