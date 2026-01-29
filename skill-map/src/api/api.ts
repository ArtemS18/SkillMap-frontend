import axios, { AxiosError, type AxiosResponse} from "axios";


axios.defaults.baseURL = "http://localhost:8090/api/";

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
export async function authorize(username: string, password: string) {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("scope", "roadmap.write roadmap.read me");
    try{
        const response = await axios.post("auth/login", data)
        localStorage.setItem("refreshToken", response.data.refresh_token);
        localStorage.setItem("accessToken", response.data.access_token);
        return response
    }catch(e: any){
        return Promise.reject(e);
    }
    

}

export async function register(email: string, password: string, firstname: string, lastname: string) {
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    data.append("firstname", firstname);
    data.append("lastname", lastname);

    return axios.post("auth/reg", data)
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});

}

export async function getGraph(topic_name: string){
    return axios.get("/skill-graph", {params: { topic: topic_name}})
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}

export async function getNodeDetails(node_id: string){
    return axios.get(`/skill-graph/${node_id}`)
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}

export async function createRoadmap(query: string){
    return axios.post("/my-roadmap/create", {"message": query})
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}

export async function getRoadmap(){
    return axios.get("/my-roadmap")
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{
            return error.response});
}

export async function compliteModuleInRoadmap(code: string){
    return axios.post(`/my-roadmap/${code}/complite`)
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}

export async function getKnowSkills(){
    return axios.get(`/user/progress`)
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}

export async function getCurrentUser(){
    return axios.get("/user/me")
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}

export async function getCurrentUserGraph(){
    return axios.get("/user/known-skill-graph")
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}