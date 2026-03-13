import { useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import './assets/styles/tailwind.css';
import {routes} from './routes/routes';
import { AuthProvider } from '@context'; // Import AuthProvider
import { LogoSpinner } from './components';
// import { Layout } from './components/layout';

function App() {
  const routing = useRoutes(routes);

  return (
    <AuthProvider>
      <Suspense fallback={<div><LogoSpinner /></div>}>
        {routing}
      </Suspense>
    </AuthProvider>
  );
};
export default App
