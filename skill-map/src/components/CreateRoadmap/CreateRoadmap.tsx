import { useState } from "react";
import { Card, Form, InputGroup, Button, Alert } from "react-bootstrap";

export type Props = {
  error: any;
  onCreate: (value: string) => void;
};

function CreateRoadmap({error, onCreate}: Props){
    const [inputValue, setInputValue] = useState<string>('')
    return (
          <>
            <Card.Title style={{margin: "20px", alignItems: "center", justifyContent: "center"}}>
                <h1>Создай новый роадмап.</h1>
            </Card.Title>
            <InputGroup className="mb-3">
                <Form.Control
                placeholder="Расскажи, о том что умеешь и что хочешь изучить"
                aria-describedby="basic-addon2"
                value={inputValue}
                onChange={(e)=>{setInputValue(e.target.value)}}
                />
                <Button 
                variant="outline-success" 
                id="button-addon2" 
                onClick={()=>{onCreate(inputValue)}}>
                    Создать
                </Button>
            </InputGroup> 
            {error.isError && 
                        (<Alert key="danger" variant="danger">
                        {error?.detail ? error.detail: "Неизвестная ошибка!"}
                        </Alert>)
                        }
            
        </>
    );
}

export default CreateRoadmap;