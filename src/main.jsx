import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { SocketProvider } from '../SocketIo.jsx'
import store from '@redux/store'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT} >
    <Provider store={store}>
      <App />
    </Provider>
   </GoogleOAuthProvider>
    </SocketProvider>
  </StrictMode>,
)
