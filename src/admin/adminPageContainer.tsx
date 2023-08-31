import React, { ReactNode, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { UserInfo } from '../types/user';

interface Props {
    userInfo: UserInfo;
    children: ReactNode;
}

const AdminPageContainer: React.FC<Props> = ({ userInfo, children }) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    useEffect(() => {
        if (userInfo != null && userInfo.accessLevel > 1) {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    }, [userInfo])

    if (isAdmin) {
        return (
            <div>
                {children}
            </div>
        );
    } else {
        return (
            <div>
                <h1>Error 404: Permission denied</h1>
                <p>{userInfo?.accessLevel}</p>
            </div>
        );
    }
}

export default AdminPageContainer