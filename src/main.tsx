import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppRouter } from './routes/AppRouter'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>,
)