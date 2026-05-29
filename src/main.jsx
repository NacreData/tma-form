import { Provider } from "./components/ui/provider.jsx"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import DataStoreProvider from './DataStoreProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <DataStoreProvider>
        <App />
      </DataStoreProvider>
    </Provider>
  </StrictMode>,
)
