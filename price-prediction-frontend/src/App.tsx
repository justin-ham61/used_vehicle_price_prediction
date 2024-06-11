import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import './App.css'
import '../tailwind.css'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import Example from './components/dialogue'

function App() {
  const [ style, setStyle ] = useState({
    left: '0%'
  })
  const [ showMain, setShowMain ] = useState(true);
  const [ showForm, setShowForm ] = useState(false);
  const [ showLoading, setShowLoading ] = useState(false);
  const [ showPrediction, setShowPrediction ] = useState(false)
  const [ showDialogue, setShowDialogue ] = useState(false)
  const [ carData, setCarData ] = useState<any | null>(null)
  const [ predictedPrice, setPredictedPrice ] = useState({
    price: '',
    lowMilePrice: '',
    highMilePrice: ''
  })

  //Option Selection
  const [ optionSelection, setOptionSelection ] = useState<any>({
    make:'',
    model:'',
    mileage:'',
    year:'',
    engine:'',
    transmission:'',
    drivetrain:'',
  })

  const [ accessoryOptions, setAccessoryOptions ] = useState<any>({
    'Damages': false,
    'First Owner': false, 
    'Personal': false,
    'Turbo': false,
    'Cruise': false,
    'Navigation': false,
    'Power Lift': false,
    'Backup Camera': false,
    'Keyless Entry': false,
    'Remote Start': false,
    'Sunroof': false,
    'Leather Seats': false,
    'Memory Seats': false,
    'Apple/Google Car': false,
    'Bluetooth': false,
    'USB': false,
    'Heated Seats': false,
    'Allow Wheels': false,
    'Third Row Seating': false,
    'Stability Control': false,
    'Emergency Braking': false,
    'Automatic Transmission': false
  })

  //Option Array Creation
  const [ makes, setMakes ] = useState<string[]>([])
  const [ models, setModels ] = useState<string[]>([])
  const [ years, setYears ] = useState([])
  const [ engines, setEngines ] = useState([])
  const [ transmissions, setTransmissions ] = useState([])
  const [ drivetrains, setDrivetrains ] = useState([])

  const handleClick = () => {
    setShowMain(false)
    setShowForm(true)
  }

  const handleCheckChange = (option:any) => {
    setAccessoryOptions({...accessoryOptions, [option]: !accessoryOptions[option]})
  }

  const handleMakeChange = (e: { target: { value: any } }) => {
    setOptionSelection({
      make: e.target.value,
      model: '',
      mileage:'',
      year:'',
      engine:'',
      transmission:'',
      drivetrain:'',
    })
  }

  const handleModelChange = (e: { target: { value: any } }) => {
    setOptionSelection({
      ...optionSelection,
      model: e.target.value,
      mileage:'',
      year:'',
      engine:'',
      transmission:'',
      drivetrain:'',
    })
  }

  const handleYearChange = (e: { target: { value: any } }) => {
    setOptionSelection({...optionSelection, year: e.target.value})
  }

  const handleMileageChange = (e: { target: { value: any } }) => {
    setOptionSelection({...optionSelection, mileage: e.target.value})
  }

  const handleEngineChange = (e: { target: { value: any } }) => {
    setOptionSelection({...optionSelection, engine: e.target.value})
  }

  const handleDrivetrainChange = (e: { target: { value: any } }) => {
    setOptionSelection({...optionSelection, drivetrain: e.target.value})
  }

  const handleTransmissionChange = (e: { target: { value: any } }) => {
    setOptionSelection({...optionSelection, transmission: e.target.value})
  }

  const handleReturn = () => {
    setShowPrediction(false)
    setShowForm(true)
  }

  const makePrediction = () => {
    let validated = inputValidation()
    if(validated){
      setShowLoading(true)
      setShowForm(false)
      axios.post('http://localhost:5000/predict', {...optionSelection, ...accessoryOptions})
        .then(res => {
          setShowLoading(false)
          setShowPrediction(true)
          setPredictedPrice({
            price: res.data.predicted_price,
            lowMilePrice: res.data.low_mileage_price,
            highMilePrice: res.data.high_mileage_price
          })
        })
    } else {
      setShowDialogue(true)
    }
  }

  useEffect(() => {
    axios.get('http://localhost:5000/getinfo')
      .then((res) => {
        console.log(res.data)
        setCarData(res.data)
      })
  },[])

  useEffect(() => {
    if(carData){
      setMakes(Object.keys(carData))
    }
  },[carData])

  useEffect(() => {
    if(optionSelection.make.length > 0){
      setModels(Object.keys(carData[optionSelection.make].models))
    }
  },[optionSelection.make])

  useEffect(() => {
    if(optionSelection.model.length > 0 && carData){
      setYears(carData[optionSelection.make].models[optionSelection.model].years)
      setEngines(carData[optionSelection.make].models[optionSelection.model].engines)
      setTransmissions(carData[optionSelection.make].models[optionSelection.model].transmissions)
      setDrivetrains(carData[optionSelection.make].models[optionSelection.model].drivetrains)
    }
  },[optionSelection.model])

  useEffect(() => {
    let priceRange = parseInt(predictedPrice.lowMilePrice) - parseInt(predictedPrice.highMilePrice)
    let actualPriceInRange = parseInt(predictedPrice.price) - parseInt(predictedPrice.highMilePrice)
    let percentage = actualPriceInRange/priceRange
    console.log(percentage)
    setStyle({
      left: `${percentage * 100}%`
    })
  },[predictedPrice])

  const inputValidation = () => {
    let keys = Object.keys(optionSelection)
    for(let i = 0; i < keys.length; i++){
      console.log(keys[i])
      if(optionSelection[keys[i]].length == 0){
        return false
      }
    }
    return true
  }

  return (
    <>
      {showDialogue &&
        <Example setShowDialogue={setShowDialogue}/>
      }
      {showMain &&
      <div className='main-page'> 
        <h1>Vehicle Price Predictor</h1>
        <button onClick={handleClick}>Start</button>
      </div>
      }
      {showForm &&
      <div className='option-selection-section'>
        <h2 className='text-2xl'>Predict Price</h2>
        <div className='line'></div>
        <div className='attribute-selectors'>
          <select name="" id="" onChange={handleMakeChange} value={optionSelection.make} defaultValue='Make' className='cursor-pointer'>
            <option value="" disabled>Make</option>
            {makes.map((make) => {
              return(
                <option key={make} value={make}>{make}</option>
              )
            })}
          </select>
          <select name="" id="" onChange={handleModelChange} value={optionSelection.model} defaultValue='Model' className='cursor-pointer'>
            <option value="" disabled selected>Model</option>
            {models.map((models) => {
              return(
                <option key={models} value={models}>{models}</option>
              )
            })}
          </select>
          <select name="" id="" onChange={handleYearChange} value={optionSelection.year} defaultValue='Year' className='cursor-pointer'>
            <option value="" disabled selected>Year</option>
            {years.sort().map((year) => {
              return(
                <option key={year} value={year}>{year}</option>
              )
            })}
          </select>
          <input type="number" placeholder='Mileage' onChange={handleMileageChange} value={optionSelection.mileage} defaultValue='Mileage' className='cursor-pointer'/>
          <select name="" id="" onChange={handleEngineChange} value={optionSelection.engine} defaultValue='Engine' className='cursor-pointer'>
            <option value="" disabled selected>Engine</option>
            {engines.sort().map((engines) => {
              return(
                <option key={engines} value={engines}>{engines}</option>
              )
            })}
          </select>
          <select name="" id="" onChange={handleTransmissionChange} value={optionSelection.transmission} defaultValue='Transmission' className='cursor-pointer'>
            <option value="" disabled selected>Transmission</option>
            {transmissions.sort().map((transmission) => {
              return(
                <option key={transmission} value={transmission}>{transmission}</option>
              )
            })}
          </select>
          <select name="" id="" onChange={handleDrivetrainChange} value={optionSelection.drivetrain} defaultValue='Drivetrain' className='cursor-pointer'>
            <option value="" disabled selected>Drivetrain</option>
            {drivetrains.sort().map((drivetrains) => {
              return(
                <option key={drivetrains} value={drivetrains}>{drivetrains}</option>
              )
            })}
          </select>
        </div>
        <div className='other-options'>
          {Object.keys(accessoryOptions).map((item, i) => {
            return(
              <label className='font-thin' key={i}>{item}<input type="checkbox" onChange={() => handleCheckChange(item)} value={accessoryOptions[item]} defaultChecked={false}/></label>
            )
          })}
        </div>
        <button onClick={makePrediction} className='predict-button bg-blue-600 hover:bg-blue-400 transition duration-200'>Predict</button>
      </div>
      }
      
      {showLoading && 
        <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-20 w-20 mr-3"  width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"></path></svg>
      }
      {showPrediction &&
        <div className='prediction-section'>
          <header className='prediction-section-header'>
            <h2 >Predicted Price Summary</h2>
            <div className='return-button' onClick={handleReturn}>
              <p>Return</p>
            </div>
          </header>
          <h1 className='text-3xl'>Price: ${parseFloat(predictedPrice.price).toFixed(2)}</h1>
          <div className='prices'>
            <div className='price-pointer' style={style}> <FontAwesomeIcon icon={faLocationDot} size='xl'/> </div>
            <p>${parseFloat(predictedPrice.highMilePrice).toFixed(2)}</p>
            <p>${parseFloat(predictedPrice.lowMilePrice).toFixed(2)}</p>
          </div>
          <div className='price-bar'></div>
          <div className='prices'>
            <p>100,000 mi</p>
            <p>5,000 mi</p>
          </div>
          <div className='graph-section'>
            <img src="/images/price_distribution.png" alt="" />
            <img src="/images/price_vs_mileage.png" alt="" />
            <img src="/images/price_vs_year.png" alt="" />
          </div>
        </div>
      }
    </>
  )
}

export default App
