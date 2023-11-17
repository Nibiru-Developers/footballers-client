import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import 'react-slideshow-image/dist/styles.css'
import { Fragment, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import Router from "./router/index";

export default function App() {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Fragment>
      <Router />
      <ToastContainer />
    </Fragment>
  );
}
