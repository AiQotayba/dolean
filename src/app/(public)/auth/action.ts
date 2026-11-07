"use server"
import axios from "axios"

export default async function GetFatch(url: string, token?: string): Promise<any> {
    let headers: any = { "Content-Type": "application/json", "Accept-Language": "ar-SA" }
    if (token) headers["Authorization"] = `Bearer ${token}`

    return axios.get(`${process.env.NEXT_PUBLIC_API}${url}`, { headers })
        .then(({ data }) => data)
        .catch((error: Function) => console.log(error))
}
export const createFatch = async (url: string, body: any, token?: string): Promise<any> => {
    let headers: any = { "Content-Type": "application/json", "Accept-Language": "ar-SA" }
    if (token) headers["Authorization"] = `Bearer ${token}`
    
    return axios.post(`${process.env.NEXT_PUBLIC_API}${url}`, body, { headers })
        .then(({ data }) => {
            return data
        })
        .catch((error: Function) => console.log(error))

}
