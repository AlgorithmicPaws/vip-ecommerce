import './styles/App.css'
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home'
import Register from './pages/Register'

function App() {
  return (
    <MainLayout>
      <Home/>
      <Register/>
    </MainLayout>
  );
}

export default App;

