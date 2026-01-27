import { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { darkTheme, GraphCanvas } from 'reagraph';
import { getGraph, getNodeDetails } from '../../api/api';
import type { IEdge, INode, INodeDetails } from '../../types';
import "./MainPage.css"
import { useNavigate } from 'react-router-dom';

function MainPage(){
    const [edgesList, setEdgesList] = useState<Array<IEdge>>([])
    const [nodesList, setNodesList] = useState<Array<INode>>([])
    const [nodeDetails, setNodeDetais] = useState<INodeDetails | undefined>()
    const navigate = useNavigate()
    
    const fetchGraph = async (topic: string) =>{
        const response = await getGraph(topic);
        if (response?.status == 200){
            setEdgesList(response.data.edges)
            setNodesList(response.data.nodes)
            console.log(response.data.nodes)
        } else if (response?.status == 401){
            navigate('/login');
        }
    }

    const onNodeClick = async (node_id: string) =>{
        await fetchNodeDetails(node_id)
    }
    const fetchNodeDetails = async (node_id: string)=>{
        if (nodeDetails?.id == node_id){return}
        const response = await getNodeDetails(node_id);
        if (response?.status == 200){
            const node = response.data as INodeDetails
            setNodeDetais({
                id: node.id,
                name: node.name,
                skills: node.skills

            })
            console.log(response.data)
        } else if (response?.status == 401){
            navigate('/login');
        }
    }
    useEffect(
        ()=>{fetchGraph("python")},
        []
    )
    return (
    <Card style={{width: "100%", height: "100%", margin: "10px"}}>
        <Card.Body id="graph-card-body">
            <Card.Header>Граф навыков</Card.Header>
            <div id="graph-container">
                <div id="graph-field">
                    <GraphCanvas
                    nodes={nodesList}
                    edges={edgesList}
                    theme={
                        {...darkTheme, 
                            node: {...darkTheme.node},
                            edge: {...darkTheme.edge, opacity: 0.15},
                            cluster: { ...darkTheme.cluster, stroke: '#1E2026', label:
                                {
                                    stroke: '#1E2026', 
                                    color: '#5ff286ff'
                                } 
                            }
                        }
                    }
                    onNodeClick={node => onNodeClick(node.id)}
                    //clusterAttribute="category"
                    />
                </div>
                <div id="graph-node-details">
                    {
                        nodeDetails && (
                            <h3>{nodeDetails.name}</h3>
                        )
                    }
                    {
                        nodeDetails?.skills && nodeDetails.skills.length > 0 && (
                            <>
                                <span style={{marginBottom:"10px"}}>Скиллы которые необходимо выучить:</span>
                                <ListGroup as="ol" numbered>
                                {nodeDetails.skills.map(skill => (
                                    <ListGroup.Item
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                        key={skill.name}
                                    >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold"></div>
                                            {skill.name}
                                        </div>
                                    </ListGroup.Item>
                                ))}
                                </ListGroup>
                            </>
                        )
                    }
                    
                </div>
            </div>
      </Card.Body>
    </Card>)
}

export default MainPage
