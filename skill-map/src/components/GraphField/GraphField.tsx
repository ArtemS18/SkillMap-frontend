import { useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { darkTheme, GraphCanvas } from 'reagraph';
import type {IModule } from '../../types';
import "./GraphField.css"
import { getNodeDetails } from '../../api/api';

function GraphField(props: any){
    const {edgesList, nodesList} = props;
    const [nodeDetails, setNodeDetais] = useState<IModule | undefined>()
    
    const onNodeClick = async (node_id: string) =>{
        await fetchNodeDetails(node_id)
    }
    const fetchNodeDetails = async (node_id: string)=>{
        if (nodeDetails?.id == node_id){return}
        const response = await getNodeDetails(node_id);
        if (response.ok){
            const node = response.data as IModule
            setNodeDetais({
                id: node.id,
                name: node.name,
                skills: node.skills

            })
            console.log(response.data)
        }
    }
    return (
    <Card style={{width: "100%", height: "100%", margin: "10px"}}>
        <Card.Body id="graph-card-body">
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
                                    color: '#57b971ff'
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

export default GraphField
