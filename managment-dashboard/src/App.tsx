import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';
import { QueryProvider } from './hooks/query-provider';

function App() {
  return (
    <QueryProvider>
     <div className="w-full p-0">
      <RouterProvider router={router} />
     </div>
    </QueryProvider>
  );
}

export default App;
