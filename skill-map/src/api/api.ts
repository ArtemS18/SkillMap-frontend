import axios, { AxiosError, type AxiosResponse} from "axios";


axios.defaults.baseURL = "http://localhost:8090/api/";
export async function authorize(username: string, password: string) {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);

    return axios.post("auth/login", data)
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});

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
    const token = localStorage.getItem("accessToken");
    return axios.get("/skill-graph", {params: { topic: topic_name}, headers: {Authorization: `Bearer ${token}`}})
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}

export async function getNodeDetails(node_id: string){
    return axios.get(`/skill-graph/${node_id}`)
        .then((response: AxiosResponse)=>{return response})
        .catch((error: AxiosError)=>{return error.response});
}