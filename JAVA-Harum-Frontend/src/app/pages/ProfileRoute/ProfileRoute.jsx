import { useParams } from 'react-router-dom';
import Profile from '../Profile/Profile';
import OtherProfile from '../OtherProfile/OtherProfile';

export default function ProfileRouter() {
  const { id} = useParams();

  const loggedInUserId = localStorage.getItem('user_id');

console.log(loggedInUserId)
  if (id === loggedInUserId) {
    return <Profile />;
  } else {
    return <OtherProfile id={id} />;
  }
}
