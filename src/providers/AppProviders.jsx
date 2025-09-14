import { BrowserRouter } from 'react-router-dom';
import QueryProvider from './QueryProvider';
import ToastProvider from './ToastProvider';

const AppProviders = ({ children }) => {
  return (
    <QueryProvider>
      <BrowserRouter>
        {children}
        <ToastProvider />
      </BrowserRouter>
    </QueryProvider>
  );
};

export default AppProviders;