import { Button, Spinner, Tab, Tabs } from "react-bootstrap";
import { createRoadmap, getRoadmap, compliteModuleInRoadmap, getUserRecs, createRoadmapByIds, getModuleDetails} from "../../api/api";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../App";
import type { IRoadmap, IPath, IModuleDetails} from "../../types";
import CreateRoadmap from "../../components/CreateRoadmap/CreateRoadmap";
import ActiveRoadmap from "../../components/Roadmap/Roadmap";
import Recomments from "../../components/Recommends/Recommends";

function RoadmapPage(){
    const context = useContext(AppContext)!
    let {error, isLoading, setError, setIsLoading} = context
    
    const [activeRoadmap, setActiveRoadmap] = useState<IRoadmap>()
    const [userRecs, setUserRecs] = useState<IPath>()
    const [hasActiveRoadmap, setHasActiveRoadmap] = useState<boolean | undefined>(undefined);
    const [activeModule, setActiveModule] = useState<IModuleDetails>();

    const handelUserRect = async ()=>{
        const response = await getUserRecs();
        if (response.ok == false){
            setError({isError: true, detail: response.detail}); 
            return
        }
        setUserRecs(response.data);
    }


    const handleCreateRoadmap = async (value: string) => {
        if (value == ''){
            setError({isError: true, detail: "Заполните поле"}); 
            return;
        }
        setIsLoading(true);
        const response = await createRoadmap(value);
        setIsLoading(false);
        if (response.ok == false){
            if (response.status == 404){
                setError({isError: true, detail: "Попробуйте более делатально расписать ваши навыки"}); 
            } else if (response.status == 409){
                setError({isError: true, detail: "Роадмап уже существует"}); 
            } else{
                setError({isError: true, detail: response.detail}); 
            }
            return
        }
        setActiveRoadmap(response.data);
    }
    const handleCreateRoadmapByIds = async (value: string) =>{
        setIsLoading(true);
        const response = await createRoadmapByIds([value], []);
        setIsLoading(false);
        if (response.ok == false){
            if (response.status == 404){
                setError({isError: true, detail: "Попробуйте более делатально расписать ваши навыки"}); 
            } else if (response.status == 409){
                setError({isError: true, detail: "Роадмап уже существует"}); 
            } else{
                setError({isError: true, detail: response.detail}); 
            }
            return
        }
        setActiveRoadmap(response.data);
    }

    const handelGetUserPath = async ()=>{
        setIsLoading(true);
        const response = await getRoadmap();
        setIsLoading(false);
        if (response.ok == false){
            if (response.status == 404){
                setHasActiveRoadmap(false);
            }else{
                setError({isError: true, detail: "Произошла ошибка"}); 
            }
            return
        }
        setActiveRoadmap(response.data);
        handelGetActiveModuleDetails();
    }
    const handelGetActiveModuleDetails = async ()=>{
         const responseDetails = await getModuleDetails(activeRoadmap.current_module);
         if (responseDetails.ok == false){
            setError({isError: true, detail: "Произошла ошибка"}); 
            return
        }
        setActiveModule(responseDetails.data);
       
        console.log(activeModule)
    }
    const handelCompliteModule = async ()=>{
        const response = await compliteModuleInRoadmap(activeRoadmap.current_module);
         if (response.ok == false){
            setError({isError: true, detail: "Произошла ошибка"}); 
            return
        }
        
        setActiveRoadmap(response.data);
        console.log(activeRoadmap)
       
    }

    useEffect(()=>{handelGetUserPath(); handelUserRect()}, [])
    useEffect(()=>{setError({isError: false, detail: ""})}, [activeRoadmap])
    useEffect(()=>{handelGetActiveModuleDetails()}, [activeRoadmap])
    useEffect(() => {
        if (activeRoadmap) {
            setHasActiveRoadmap(true);
        }
    }, [activeRoadmap]);
    useEffect(()=>{if (!hasActiveRoadmap){handelUserRect()}}, [hasActiveRoadmap])

    return (
        <>
        
            {isLoading ? (
                    <>
                        <Spinner animation="border" role="status" className="mx-auto">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <h4>Создаем роадмап...</h4>
                    </>
                    
                ): (
            <>
                {
                    hasActiveRoadmap === false && (
                            <CreateRoadmap error={error} onCreate={handleCreateRoadmap}/>
                    )
                }
                {
                    
                    hasActiveRoadmap === true && activeRoadmap && (
                        <div style={{overflowY: "scroll", maxHeight: "100vh"}}>
                            <ActiveRoadmap 
                                activeRoadmap={activeRoadmap} 
                                activeModule={activeModule}
                                activeKey={activeRoadmap.complited.toString()} 
                                onCompliteModule={()=>handelCompliteModule()}
                                onCompliteRoadmap={()=>{setHasActiveRoadmap(false)}}
                                />
                        </div>
                    )
                }
                {
                    hasActiveRoadmap == false && userRecs?.path && userRecs.path.length > 0 && (
                        <Recomments recs={userRecs} onCardClick={handleCreateRoadmapByIds}/>
                    )
                }
            
            </>)
            }
            {hasActiveRoadmap === true && activeRoadmap.complited === activeRoadmap.lenght && (
                <Button 
                    variant="success" 
                    id="button-addon2" 
                    style={{margin: "10px", maxHeight: "50%"}} 
                    onClick={(e)=>{setHasActiveRoadmap(false)}}>
                    Изучить новые скилы!
                </Button>
            )
            }
        </>
    );
}

export default RoadmapPage;