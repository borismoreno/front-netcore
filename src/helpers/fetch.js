import { startLogout } from "../actions/auth";
import { store } from '../store/store';

const baseUrl = process.env.REACT_APP_API_URL;
export const fetchSinToken = (endpoint, data, method = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;

    if ( method === 'GET' ) {
        return fetch( url );
    } else {
        return fetch( url, {
            method,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
}

export const fetchConToken = (endpoint, data, method = 'GET') => {
    const url = `${baseUrl}/${endpoint}`;
    const token = localStorage.getItem('token') || '';
    try {
        if ( method === 'GET' ) {
            return fetch( url ,{
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                    // 'x-auth-token': token
                }
            })
            .then(resp => {
                if (resp.status === 401) {
                    store.dispatch(startLogout());
                }
                return resp;
            })
            .catch(err => {
                console.log('error fetch', err);
            });
        } else {
            return fetch( url, {
                method,
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    // 'x-auth-token': token
                },
                body: JSON.stringify(data)
            })
            .then(resp => {
                if (resp.status === 401) {
                    store.dispatch(startLogout());
                }
                return resp;
            })
            .catch(err => {
                console.log('error fetch', err);
            });
        }
    } catch (error) {
        console.log('Error token', error);
    }
}