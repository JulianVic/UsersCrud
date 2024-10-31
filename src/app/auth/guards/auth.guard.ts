import { inject } from "@angular/core";
import { Router } from "@angular/router";
import {jwtDecode} from "jwt-decode";

export const AuthGuard = () => {
    const router = inject(Router);
    const token = sessionStorage.getItem('access_token');

    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp && decodedToken.exp < currentTime) {
                sessionStorage.removeItem('access_token');
                router.navigate(['/login']);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Invalid token', error);
            sessionStorage.removeItem('access_token');
            router.navigate(['/login']);
            return false;
        }
    } else {
        router.navigate(['/login']);
        return false;
    }
};
