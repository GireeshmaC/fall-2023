import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectUser } from '../redux/userSlice'

const Protected = ({ children }) => {
  const user = useSelector(selectUser)

  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
export default Protected
