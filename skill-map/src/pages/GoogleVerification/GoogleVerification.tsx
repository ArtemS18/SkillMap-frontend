import Card from 'react-bootstrap/Card'
import { authorizeOAuth } from '../../api/api'
import { useContext, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import {useNavigate } from 'react-router-dom'
import {AppContext} from '../../App'

function GoogleVerification() {
  const context = useContext(AppContext)!
  let {error, isLoading, setError, setIsLoading} = context
  let navigate = useNavigate()
  const onSubmit = async() => {
    setIsLoading(true);
    setError({isError: false, detail: undefined});
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    if (error){
        setError({isError: true, detail: error});
        return
    } 
    const code = params.get("code")
    if (!code){
        setError({isError: true, detail: "Отсутствут query:code"});
        return
    }
    const response = await authorizeOAuth(code)
    setIsLoading(false);
    if (response.ok == false) {
      setError({ isError: true, detail: response.detail});
      return;
    }
    localStorage.setItem("accessToken", response.data.access_token);
    localStorage.setItem("refreshToken", response.data.refresh_token);
    navigate("/");
  }
  useEffect(()=>{onSubmit()}, [])
  return (
    <div className="form-container">
          {error.isError ? 
          (<Alert key="danger" variant="danger">
            {error?.detail ? error.detail: "Неизвестная ошибка!"}
          </Alert>) :
            (
                <>
                    {isLoading ? (
                        <Card.Title>Подождите...</Card.Title>
                    ):(
                        <Card.Title>Проверка пройдена ✅</Card.Title>
                    )}
                </>
            )
          }
    </div>
  )
}

export default GoogleVerification


