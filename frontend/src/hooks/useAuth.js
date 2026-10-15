import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
    const token = localStorage.getItem('authToken')
    let userEmail = '';
    let userRole = '';
    let isLoggedIn = false;
    let userId = '';


    if(token){
        const decoded = jwtDecode(token);
        const { email, role, id} = decoded.userInfos;
        userEmail = email;
        userRole = role;
        userId = id;
        isLoggedIn = true;
    }
    return { userEmail, userRole, userId, isLoggedIn };
}