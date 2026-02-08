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
  let {error, isLoading, setError, setIsLoading, setUserData} = context
  let navigate = useNavigate()
  const onFormSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({isError: false, detail: undefined});
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const password_check = formData.get('password_check') as string

    if (!email){
      setError({isError: true, detail: "Введите почту"});
      return
    }
    if (!password){
      setError({isError: true, detail: "Введите пароль"});
      return
    }
    if (!name){
      setError({isError: true, detail: "Введите имя"});
      return
    }
    if (password != password_check){
      setError({isError: true, detail: "Пароли не совпадают"});
      return
    }

    setIsLoading(true);
    const response = await register(email, password, name)
    setIsLoading(false);

    if (response.ok == false){
      setError({isError: true, detail: response.detail});
      return
    }

    localStorage.setItem("verifyEmail", email);
    navigate("/verify-email");
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
              <Form.Control type="name" name='name' placeholder="Введите ваше имя" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="password" name='password' placeholder="Придумайте пароль" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control type="password" name='password_check' placeholder="Повторите пароль" />
            </Form.Group>

            <Button variant="success" 
              type="submit" 
              className="submit-button w-100" 
              disabled={isLoading}>
                {(isLoading == false) ? "Создать аккаунт" : "Подождите..."}
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
