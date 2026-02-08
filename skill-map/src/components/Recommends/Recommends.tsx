import { Button, Card, Row } from "react-bootstrap"
import type { IPath } from "../../types"

type RecsProps = {
    recs: IPath
    onCardClick: (id: string)=>void
}


function Recomments({recs, onCardClick}: RecsProps){

    return (
        <>
            <div style={{padding: "20px", justifyContent: "center"}}>
                <h1>Рекомендуем изучить</h1>
                <Card.Body>
                <Row xs={5} md={5} className="g-4" style={{justifyContent: "center"}}>
                    {
                        recs.path.map((v)=>{
                            return (
                                <>
                                    <Card border="secondary" key={v.id} style={{ width: '15rem', padding: '0'}} >
                                        <Card.Header>Модуль</Card.Header>
                                        <Card.Body>
                                        <Card.Title>{v.name}</Card.Title>
                                        <Button variant="outline-secondary" onClick={(e)=>onCardClick(v.id)}>Изучить</Button>
                                        </Card.Body>
                                    </Card>
                                    <br/>
                                </>
                                
                            )
                        })
                    }
                </Row>
                </Card.Body>
            </div>
        </>
    )
}

export default Recomments