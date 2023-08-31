import Button from '@mui/material/Button';
import React from 'react'
import { Link } from 'react-router-dom';
import { useStateValue } from '../context/StateProvider';
import AdminPageContainer from './adminPageContainer'

function AdminDashboard() {
    const [{ userInfo }] = useStateValue();

    return (
        <AdminPageContainer userInfo={userInfo}>
            <div>
                <Link to="/admin/poster/?JohnLennonTrippy">
                    <p>Update Poster</p>
                </Link>
                <Link to="/admin/poster/">
                    <p>Create Poster</p>
                </Link>
                <Link to="/admin/poster/location">
                    <p>Update Poster Location</p>
                </Link>
            </div>
        </AdminPageContainer>
    )
}

export default AdminDashboard