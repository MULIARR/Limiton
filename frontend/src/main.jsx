import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import { ReactQueryDevtools } from 'react-query/devtools';
import { NextUIProvider } from '@nextui-org/react';
import App from './App/App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NextUIProvider>
      <main className="dark text-foreground">
        <App />
        <ReactQueryDevtools initialIsOpen={true} />
      </main>
    </NextUIProvider>
  </QueryClientProvider>
);
