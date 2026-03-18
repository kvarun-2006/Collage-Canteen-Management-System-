
import './App.css';
import Navbar from './components/Navbar';
import Textfield from './components/Textfield';
import About from './components/About';
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom';
function App() {

  return (
    <Router>
      <Navbar title="Text Analyzer"/>
      <Routes>
        <Route path='/home' element={<Textfield/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>
    </Router>
  );
}

export default App;
