export interface ApiError{
    isError: boolean
    detail: string | undefined    
}

export interface IEdge{
    id: string
    source: string
    target: string
    kid: string
}


export interface INode{
    id: string
    label: string
    kid: string
}
export interface ISkill{
    id: string
    name: string
}
export interface INodeDetails{
    id: string
    name: string
    skills: Array<ISkill>
}