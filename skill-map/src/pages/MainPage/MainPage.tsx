import { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { getCurrentUserGraph } from '../../api/api';
import type { IEdge, INode, INodeDetails } from '../../types';
import "./MainPage.css"
import { useNavigate } from 'react-router-dom';
import GraphField from '../../components/GraphField/GraphField';

function MainPage(){
    const [edgesList, setEdgesList] = useState<Array<IEdge>>([])
    const [nodesList, setNodesList] = useState<Array<INode>>([])
    const navigate = useNavigate()
    
    // const fetchGraph = async (topic: string) =>{
    //     const response = await getGraph(topic);
    //     if (response?.status == 200){
    //         setEdgesList(response.data.edges)
    //         setNodesList(response.data.nodes)
    //         console.log(response.data.nodes)
    //     } else if (response?.status == 401){
    //         navigate('/login');
    //     }
    // }

    const fetchUserGraph = async (topic: string) =>{
            const response = await getCurrentUserGraph();
            if (response?.status == 200){
                setEdgesList(response.data.edges)
                setNodesList(response.data.nodes)
                console.log(response.data.nodes)
            }
        }

    useEffect(
        ()=>{fetchUserGraph("python")},
        []
    )
    return (
        <>
        {nodesList.length > 0 ? (
                <>
                <Card.Title style={{margin: "20px", alignItems: "center", justifyContent: "center"}}>
                    <h1>Твой граф изученных навыков</h1>
                </Card.Title>
                
                <GraphField nodesList={nodesList} edgesList={edgesList}></GraphField>
                </>
            ): (
                <>
                <Card.Title style={{margin: "20px", alignItems: "center", justifyContent: "center"}}>
                    <h1>Здесь будет виден твой прогресс</h1>
                </Card.Title>
                </>
            )}
        </>
    )
}

export default MainPage
