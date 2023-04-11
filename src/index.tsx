import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FetchApi from './FetchApi';
import reportWebVitals from './reportWebVitals';
import "./index.css";
import {createBrowserRouter,RouterProvider,Route} from "react-router-dom";
import LoginPage from './LoginPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path:"/callback",
    element: <FetchApi />
  },
  {
    path:"/login",
    element: <LoginPage/>
  },
])
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
