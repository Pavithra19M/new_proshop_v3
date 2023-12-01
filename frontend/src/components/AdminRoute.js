import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () =>{

    //Outlet it returns if user is logged in 
    //Navigate if user is not logged in, navigates to login page
    //userInfo is used to check user is logged in or not
    const {userInfo} = useSelector((state) => state.auth)

    return(
        <>
             {/* replace is used to have past history */}
            {userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to='/login' replace/>}
        </>
    )
}

export default AdminRoute