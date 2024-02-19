import './App.css'
import Card from './Card'
import Slider from './Slider'

const arr = new Array(6).fill(0)

function App() {

  return (
    <Slider buttons>
      {arr.map((_, index) => <Card key={index} />)}
    </Slider>
  )
}

export default App
