import { AxiosRequestConfig } from "axios";
import { defer, map, Observable } from "rxjs";

import { axiosRequestConfiguration } from "./config";
import initialization from "./initialization";

const axiosInstance = initialization(axiosRequestConfiguration);

const get = <T>(url: string, queryParams?: AxiosRequestConfig): Observable<T> => {
    return defer(()=> axiosInstance.get<T>(url, { params: queryParams }))
        .pipe(map(result => result.data));
};

const post = <T>(url: string, body: object, queryParams?: AxiosRequestConfig): Observable<T | void> => {
    return defer(()=> axiosInstance.post<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

const put = <T>(url: string, body: object, queryParams?: AxiosRequestConfig): Observable<T | void> => {
    return defer(()=>axiosInstance.put<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

const patch = <T>(url: string, body: object, queryParams?: AxiosRequestConfig): Observable<T | void> => {
    return defer(()=> axiosInstance.patch<T>(url, body, { params: queryParams }))
        .pipe(map(result => result.data));
};

const deleteR = <T>(url: string, id:number): Observable<T | void> => {
    return defer(() => (axiosInstance.delete(`${url}/${id}` )))
        .pipe(map(result => result.data)
    );
};

export default { get, post, put, patch, delete: deleteR };