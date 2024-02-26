import './App.css'
import Card from './Card'
import Slider from './Slider'

const arr = new Array(6).fill(0)

function App() {

  return (
    <>
      <Slider config={{
        buttons: true,
        progress: true,
        hideScroll: true,
        dots: true,
        perPage: 1
      }}>
        {arr.map((_, index) => <Card key={index} />)}
      </Slider>
      <div className='scroll'>
        <div />
        <div className='scroll-progress' />
      </div>
    </>
  )
}

export default App
