import { Button, Card, Form, InputGroup } from "react-bootstrap";

function RoadmapPage(){
    return (
        <>
        <Card className="d-flex" style={{width: "100%", height: "85vh"}}>
            <Card.Title style={{margin: "20px", alignItems: "center", justifyContent: "center"}}>
                <h1>Создай новый роадмап.</h1>
            </Card.Title>
            <InputGroup className="mb-3 w-50">
                <Form.Control
                placeholder="Расскажите, о том что умеете и что хотите изучить"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                as="textarea" 
                />
                <Button variant="success" id="button-addon2">
                    Создать путь
                </Button>
            </InputGroup>
        </Card>
        </>
    );
}

export default RoadmapPage;