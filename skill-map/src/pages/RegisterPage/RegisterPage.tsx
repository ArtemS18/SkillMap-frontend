import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import './RegisterPage.css'
import { register } from '../../api/api'
import { useContext } from 'react'
import { Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import {AppContext} from '../../App'

function RegisterPage() {
  const context = useContext(AppContext)!
  let {error, isLoading, setError, setIsLoading} = context
  let navigate = useNavigate()
  const onFormSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({isError: false, detail: undefined});
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstname = formData.get('firstname') as string
    const lastname = formData.get('lastname') as string
    try{
      const timeot = setTimeout(()=>{setIsLoading(false); throw new Error("Долгое ожидание")}, 1000*10);
      const response = await register(email, password, firstname, lastname)
      clearTimeout(timeot);
      if (response?.status != 201){
        setError({isError: true, detail: response?.data.detail});
      }else{
        navigate("/login");
      }
    }catch(e: Error | any){
      setError({isError: true, detail: e?.message || "Ошибка сети"});
    }finally{
      setIsLoading(false);
    }
      
  }

  return (
    <div className="form-container">
      <Card className="form-card">
        <Card.Body>
          {error.isError && 
          (<Alert key="danger" variant="danger">
            {error?.detail ? error.detail: "Неизвестная ошибка!"}
          </Alert>)
          }
          <Card.Title className="text-center mb-4">
            Регистрация
          </Card.Title>

          <Form onSubmit={onFormSubmit} className="basic-form">
            <Form.Group className="mb-3">
              <Form.Control type="email" name='email' placeholder="Введите почту" />
            </Form.Group>
            <Form.Group className="mb-3"> 
              <Form.Control type="firstname" name='firstname' placeholder="Введите имя" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="lastname" name='lastname' placeholder="Введите фамилию" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="password" name='password' placeholder="Придумайте пароль" />
            </Form.Group>

            <Button variant="success" type="submit" className="submit-button w-100" disabled={isLoading}>
              {!isLoading ? "Создать аккаунт" : "Подождите..."}
            </Button>
             <Link to="/login">
                Войти
            </Link>
          </Form>

        </Card.Body>
      </Card>
    </div>
  )
}

export default RegisterPage
