import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/header/header.component";
import Footer from "../../components/footer/footer.component";


const Layout = () => {
    return (
        <Fragment>
            <Header></Header>
            <Outlet />
            <Footer></Footer>
        </Fragment>
    );
};

export default Layout;