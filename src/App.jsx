import ProfileView from './components/ProfileView.jsx';
import { MOCK_PLAYER } from './data/mockPlayer.js';

export default function App() {
  return <ProfileView player={MOCK_PLAYER} />;
}
