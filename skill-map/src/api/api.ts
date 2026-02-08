import axios, { AxiosError, type AxiosResponse} from "axios";
import { type IRoadmap, type IModule, type LoginResponse, type IPath, type IModuleDetails } from "../types";

axios.defaults.baseURL = "http://localhost:80/api/";

axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let failedQueues:Array<{
    resolve: (token: string)=>void,
    reject: (err: any)=>void
}> = [];
let isRefreshing = false;


axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && error.config && !(error.config as any)._retry && !error.config.url?.includes("auth/refresh") && !error.config.url?.includes("auth/login")) {
        console.log("Trying to refresh token");
        if (isRefreshing) {
            return new Promise((resolve, reject) => {failedQueues.push({resolve, reject});}).then((token) => {
                error.config.headers['Authorization'] = 'Bearer ' + token;
                return axios(error.config);
            }
            ).catch((err) => {
                return Promise.reject(err);
            });
        }
        isRefreshing=true;
        (error.config as any)._retry = true;
        try{
            console.log("Send to refresh token");
            const response = await axios.post("auth/refresh", {"refresh_token": localStorage.getItem("refreshToken")});
            if (response.status != 200){
                throw new Error("Не удалось обновить токен");
            }
            setToken(response.data.access_token);
            localStorage.setItem("refreshToken", response.data.refresh_token);
            failedQueues.forEach(prom=>{
                prom.resolve(response.data.access_token)
            })
            isRefreshing=false;
            failedQueues = [];
        }catch(error){
            console.log("Fail to refresh token");
            failedQueues.forEach(prom=>{
                prom.reject(error)
            })
            failedQueues = [];
            logout();
            return Promise.reject(error);
        }finally{
            isRefreshing=false;
        }

        }
        return Promise.reject(error)
    }
    
);
export function logout(){
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
}


function getAccessToken() {
    const token = localStorage.getItem("accessToken");
    return token;
}

export function setToken(token: string){
    localStorage.setItem("accessToken", token);
}

type ApiResponese<T> = | {ok: true; data: T} | {ok: false; detail: string; status?: number}


export async function apiCall<T>(request: ()=>Promise<AxiosResponse<T>>): Promise<ApiResponese<T>>{
    try{
        const res = await request()
        return {
            ok: true,
            data: res.data
        }
    } catch (err){
        const e = err as AxiosError<any>;
        return {
            ok: false,
            detail: e.response?.data?.detail ?? "Произошла ошибка",
            status: e.response?.status
        }

    }
    
}
export async function authorize(username: string, password: string) {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("scope", "roadmap.write roadmap.read me");
    return apiCall<LoginResponse>(()=>axios.post("auth/login", data))
}

export async function authorizeOAuth(code: string) {
    return apiCall<LoginResponse>(()=>axios.post("auth/google/callback", {"code": code}))
}


export async function register(email: string, password: string, name: string) {
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    data.append("name", name);

    return apiCall(()=>axios.post("auth/reg", data))

}

export async function send_code_in_email(email: string) {

    return apiCall(()=>axios.post("auth/send-verify-code", {"to_email": email}))
}

export async function verify(email: string, code: string) {

    return apiCall(()=>axios.post("auth/verify-email", {"email": email, "code": code}))

}

export async function getGraph(topic_name: string){
    return apiCall(()=>axios.get("/skill-graph", {params: { topic: topic_name}}))
}

export async function getNodeDetails(node_id: string){
    return apiCall<IModule>(()=>axios.get(`/skill-graph/${node_id}`))
}

export async function createRoadmap(query: string){
    return apiCall<IRoadmap>(()=>axios.post("/my-roadmap/create", {"message": query}))
}

export async function getRoadmap(){
    return apiCall<IRoadmap>(()=>axios.get(`/my-roadmap/`))
}

export async function compliteModuleInRoadmap(code: string){
    return apiCall<IRoadmap>(()=>axios.post(`/my-roadmap/${code}/complite`))
}

export async function getKnowSkills(){
    return apiCall(()=>axios.get(`/user/progress`))
}

export async function getCurrentUser(){
    return apiCall(()=>axios.get("/user/me"))
}

export async function getCurrentUserGraph(){
    return apiCall(()=>axios.get("/user/known-skill-graph"))
}

export async function getUserRecs(){
    return apiCall<IPath>(()=>axios.get("/user/recommends", {params: {limit: 4}}))
}


export async function createRoadmapByIds(target_ids: Array<string | null>, know_ids: Array<string | null>){
    return apiCall<IRoadmap>(()=>axios.post("/my-roadmap/create-by-skills", {
        "target_skills": target_ids, 
        "known_skills": know_ids
    }))
}


export async function getModuleDetails(id: string){
    return apiCall<IModuleDetails>(()=>axios.get(`/skill-graph/${id}/details`))
}

export async function oauthGoogleRedirect(){
    return apiCall<IModuleDetails>(()=>axios.get(`/auth/google`))
}

