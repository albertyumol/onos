import React, { useState, useEffect } from 'react'
import Panel from './Panel';
import Header from './Header';
import WeatherMap from './WeatherMap';
import Map from './Map';
import nprogress from 'nprogress'
import Axios from 'axios';

const Responder = () => {

  const [layers, setLayers] = useState([])
  const [covidMap, setCovidMap] = useState(null)
  const [cases, setCases] = useState(null)

  const createCovidMap = (data) => {
    let collection = {
      "type": "FeatureCollection",
      "features": []
    }

    data.forEach(item => {
      collection.features.push(
        {
          "type": "Feature",
          "properties": {
            "id": item.id,
            "mag": 0.5,
            "time": 1507425650893,
            "felt": 1,
            "tsunami": 0
          },
          "geometry": {
            "type": "Point",
            "coordinates": [item.east_coord, item.north_coord, 0]
          }
        }
      )
    });

    setCovidMap(collection)
    console.log("covid map", collection)

  }

  useEffect(() => {
    nprogress.start()
    Axios.get('/dataset/cases.json')
      .then(res => {
        console.log(res.data.length)
        let processedItems = []
        let parseData = res.data.filter(x => {
          if (!processedItems.includes(x.id) && x.north_coord !== "" && x.east_coord !== "") {
            processedItems.push(x.id)
            return x
          }
        })
        createCovidMap(parseData)
        setCases(parseData)
        nprogress.done()
      })

  }, [])

  return (
    <>
      <Header layers={layers} setLayers={setLayers} />


      <WeatherMap layers={layers} />

      {covidMap && (
        <Map layers={layers} covidMap={covidMap} />
      )}


      <div>
        <Panel covidData={cases} />
      </div>
    </>
  )
}

export default Responder;