import authService from '../services/auth.service'
import { Navigate } from 'react-router-dom';

export default function AuthRoute(props){
    const user = authService.getCurrentUser();
  
    if (!user) {
        return <Navigate to="/login" replace /> 
    }
  
    return (
      <>
        {props.children}
      </>
    )
}