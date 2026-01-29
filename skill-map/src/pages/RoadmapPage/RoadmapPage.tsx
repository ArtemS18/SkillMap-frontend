import { Button, Card, Form, InputGroup, Accordion, ListGroup, Spinner, Alert } from "react-bootstrap";
import { createRoadmap, getRoadmap, compliteModuleInRoadmap, getCurrentUserGraph} from "../../api/api";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../App";
import { type IEdge, type INode, type IRoadmap } from "../../types";
import { Navigate, useNavigate } from "react-router-dom";

function RoadmapPage(){
    const context = useContext(AppContext)!
    let {error, isLoading, setError, setIsLoading} = context
    
    const navigate = useNavigate()

    const [activeRoadmap, setActiveRoadmap] = useState<IRoadmap>()
    const [hasActiveRoadmap, setHasActiveRoadmap] = useState<boolean | undefined>(undefined);
    const [inputValue, setInputValue] = useState<string>('')
    const [activeKey, setActiveKey] = useState('0');

    useEffect(() => {
        if (activeRoadmap) {
            setActiveKey(activeRoadmap.complited.toString());
            setHasActiveRoadmap(true);
        }
    }, [activeRoadmap]);
    const handleCreateRoadmap = async (e: React.MouseEvent) => {
        
        if (inputValue == ''){
            setError({isError: true, detail: "Заполните поле"}); 
            return;
        }
        setIsLoading(true);
        const response = await createRoadmap(inputValue);
        setIsLoading(false);
        if (response?.status == 200){
            setActiveRoadmap(response.data);
        }else if (response?.status == 404){
            setError({isError: true, detail: "Попробуйте более делатально расписать ваши навыки"}); 
        }
        
    }

    const handelGetUserPath = async ()=>{
        setIsLoading(true);
        const response = await getRoadmap();
        setIsLoading(false);
        if (response?.status == 200){
            setActiveRoadmap(response.data);
        } else if (response?.status == 404){
            setHasActiveRoadmap(false);
        } else {
            setError({isError: true, detail: "Произошла ошибка"}); 
        }
    }

    const handelCompliteModule = async (e: React.MouseEvent)=>{
        const response = await compliteModuleInRoadmap(activeRoadmap?.current_module);
        if (response?.status == 200){
            setActiveRoadmap(response.data);
        }
    }

    useEffect(()=>{handelGetUserPath()}, [])
    useEffect(()=>{setError({isError: false, detail: ""})}, [activeRoadmap])
    const visibleModules = activeRoadmap?.path.slice(activeRoadmap?.complited ?? 0) ?? [];
    return (
        <>
        {isLoading ? (
                <>
                    <Spinner animation="border" role="status" className="mx-auto">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </>
                
            ): (
        <>
            {
                hasActiveRoadmap === false && (
                    <>
                        <Card.Title style={{margin: "20px", alignItems: "center", justifyContent: "center"}}>
                            <h1>Создай новый роадмап.</h1>
                        </Card.Title>
                        <InputGroup className="mb-3 w-50 mx-auto">
                            <Form.Control
                            placeholder="Расскажи, о том что умеешь и что хочешь изучить"
                            aria-describedby="basic-addon2"
                            value={inputValue}
                            onChange={(e)=>{setInputValue(e.target.value)}}
                            />
                            <Button variant="outline-success" id="button-addon2" onClick={(e)=>{handleCreateRoadmap(e)}}>
                                Создать
                            </Button>
                        </InputGroup> 
                        {error.isError && 
                                    (<Alert key="danger" variant="danger">
                                    {error?.detail ? error.detail: "Неизвестная ошибка!"}
                                    </Alert>)
                                    }
                        
                    </>
                )
            }
            {
                
                hasActiveRoadmap === true && activeRoadmap && (
                    <>
                        <Card.Title style={{margin: "20px", alignItems: "center", justifyContent: "center"}}>
                            <h1>Твой текущий роадмап</h1>
                        </Card.Title>
                        <Accordion activeKey={activeKey} flush={true} className="mb-3 w-50 mx-auto">
                            {visibleModules.map(
                                (step, i) => {
                                const index = i + activeRoadmap.complited;
                                return ( 
                                <>
                                    <Accordion.Item eventKey={index.toString()} >
                                        <Accordion.Header>
                                            
                                            <span style={activeRoadmap.complited !== index ? { color: "#aaa", pointerEvents: "none" } : {}}>
                                                {index < activeRoadmap.complited && (
                                                    <span className="ms-2">✅</span>
                                                )}{step.name}
                                            </span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {
                                                step?.skills 
                                                && step.skills.length > 0 
                                                && (
                                                    <>
                                                        <h4>Что тебе нужно изучить</h4>
                                                        <ListGroup as="ol" numbered>
                                                        {step.skills.map(skill => (
                                                            <ListGroup.Item
                                                                as="li"
                                                                className="d-flex justify-content-between align-items-start"
                                                                key={skill.id}
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
                                            {
                                                activeRoadmap.complited === index && (
                                                    <Button variant="success" id="button-addon2" style={{margin: "10px"}} onClick={(e)=>{handelCompliteModule(e)}}>
                                                        Завершить модуль!
                                                    </Button>
                                                )
                                            }
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </>)}
                            )}
                           
                        </Accordion>
                        {
                            activeRoadmap.complited === activeRoadmap.lenght && (
                            <Button variant="success" id="button-addon2" style={{margin: "10px", maxHeight: "50%"}} onClick={(e)=>{setHasActiveRoadmap(false)}}>
                                Изучить новые скилы!
                            </Button>
                        )
                        }
                    </>
                )
            }
            
        </>)
        }
        </>
    );
}

export default RoadmapPage;