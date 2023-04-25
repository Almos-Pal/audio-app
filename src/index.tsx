import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./index.css";
import {createBrowserRouter,RouterProvider,Route} from "react-router-dom";
import LoginPage from './LoginPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


function Router() {
  const [searchParams, setSearchParams] = useState('');

  const router = createBrowserRouter([
    {
      path: '/callback',
      element: <App/>,
    },
    {
      path: '/login',
      element: <LoginPage/>,
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>
  );
}
root.render(<Router />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();