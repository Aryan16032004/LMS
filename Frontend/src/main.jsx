import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import {Auth} from './Component/index.js'
import { BrowserRouter ,createBrowserRouter,RouterProvider} from 'react-router-dom'
import Login from './Component/Login.jsx'
import Dashboard from './page/Dashboard.jsx'
import { Provider } from 'react-redux'
import CoursePage from './page/CoursePage.jsx'


const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element: (
          <Auth authentication={false}>
            <Login />
          </Auth>
        ),
      },
      {
        path:"/dashboard",
        element:(
          <Auth authentication>
            {""}
            <Dashboard/>
          </Auth>
        )
      },
      {
        path: "/course/:id",
        element: (
          <Auth authentication>
            {""}
            <CoursePage/>
          </Auth>
        ),
    },
    ]
  }
])
createRoot(document.getElementById('root')).render(
 
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>
 
  
)
