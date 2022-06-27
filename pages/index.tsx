import Link from "next/link"
import React, { Children, useEffect, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"

import venues from "../utils/venues"
import { venue } from "../utils/venues"

import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"
import { render } from "react-dom"


function HomePage() {

  const [allVenues, setAllVenues] = useState<venue[]>(venues)
  const [selectedVenue, setSelectedVenue] = useState<venue>(venues[0])
  const [displayedVenue, setDisplayedVenue] = useState<venue>(venues[0])

  const [time, setTime] = useState({ hour: 0, min: 0 })

  // displayed data hourly
  const [busyness, setBusyness] = useState(0)
  const [expected, setExpected] = useState(0)
  const [checkin, setCheckin] = useState({ hour: 0, min: 0 })
  const [checkinIntl, setCheckinIntl] = useState({ hour: 0, min: 0 })

  // daily flights and airport size
  const [flights, setFlights] = useState(0)
  const [airportSize, setAirportSize] = useState(0)

  const [allFlights, setAllFlights] = useState([])

  // displayed data weekly
  const [weekly, setWeekly] = useState([])
  const [daily, setDaily] = useState([])

  const [loading, isLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const runCheck = async () => {
    if (fetched && displayedVenue == selectedVenue) return

    // set the current time
    let now = new Date()
    setTime({ hour: now.getHours(), min: now.getMinutes() })

    isLoading(true)

    await fetchVenueInformation().then(() => {
      setFetched(true)
      isLoading(false)
    })
    setDisplayedVenue(selectedVenue)

  }

  const fetchVenueInformation = async () => {

    const options = {
      method: "GET",
      url: `https://flightqdb.herokuapp.com/venue_information/${selectedVenue.tag}`,
      params: {
        id: selectedVenue.id,
        tag: selectedVenue.tag,
        venue_name: selectedVenue.venue_name,
        venue_address: selectedVenue.venue_address
      }
    }

    await axios.request(options).then((response) => {
      console.log(response.data)

      if (response.data['busyness']['data']['analysis']['venue_live_busyness_available'] == true) {
        setBusyness(response.data['busyness']['data']['analysis']['venue_live_busyness'])
      }
      else {
        setBusyness(response.data['busyness']['data']['analysis']['venue_forecasted_busyness'])
      }

      setExpected(response.data['busyness']['data']['analysis']['venue_forecasted_busyness'])
      setDaily(response.data['dailyChart']['data']['analysis']['day_raw'])

      if ((response.data['flights']['data']['airport']['flights']['flight']) == null) {
        setFlights(0)
      }
      else {
        let flights = Object.keys(response.data['flights']['data']['airport']['flights']['flight']).length
        setFlights(flights)
      }

      if ((response.data['airportSize']['data']['airport']['flights']['flight']) == null) {
        setFlights(0)
      }
      else {
        let airportSize = Object.keys(response.data['airportSize']['data']['airport']['flights']['flight']).length
        setAirportSize(airportSize)
        setAllFlights(response.data['airportSize']['data']['airport']['flights']['flight'])
      }
    })
  }

  const StatsDisplay = () => {
    return (
      <div className={`flex flex-col px-4 bg-slate-900 mt-12 gap-6 ${fetched ? "" : "hidden"}`}>

        <div className="flex flex-row place-content-between md:flex-row gap-6 ">

          <motion.div initial="hidden" animate="visible" variants={{
            hidden: {
              y: 40,
              scale: 0.9,
              opacity: 0
            },
            visible: {
              y: 0,
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.3
              }
            }
          }}>
            <CheckInBox title="Check-in innland:" hour={Math.floor((30 + (busyness / 2) + ((busyness - expected) / 2)) * (1 + (flights / airportSize)) / 60)} min={(30 + (busyness / 2) + ((busyness - expected) / 2)) * (1 + (flights / airportSize)) % 60} percent={1} />
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={{
            hidden: {
              y: 40,
              scale: 0.9,
              opacity: 0
            },
            visible: {
              y: 0,
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.38
              }
            }
          }}>
            <CheckInBox title="Check-in utland:" hour={Math.floor((50 + (busyness) + ((busyness - expected) / 2)) * (1 + (flights / airportSize)) / 60)} min={(50 + (busyness) + ((busyness - expected) / 2)) * (1 + (flights / airportSize)) % 60} percent={0.6} />

          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={{
            hidden: {
              y: 40,
              scale: 0.9,
              opacity: 0
            },
            visible: {
              y: 0,
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.45
              }
            }
          }}>
            {liveTrafficBox("Fotgjenger trafikk:", busyness)}
          </motion.div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={{
          hidden: {
            y: 40,
            scale: 0.9,
            opacity: 0
          },
          visible: {
            y: 0,
            scale: 1,
            opacity: 1,
            transition: {
              delay: 0.46
            }
          }
        }}>
          <ChartDayDisplay />
          <FlightsDisplay />
        </motion.div>

      </div>
    )
  }

  const CheckInBox = (props) => {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg h-52 w-52">
        <div className="flex flex-col pl-2 w-fit h-fit">
          <p className="text-slate-500 font-semibold">
            {props.title}

          </p>
          <h1 className={`flex pt-12 pl-5 font-semibold drop-shadow-xl text-5xl ${getBusyColor(props.hour, props.min, props.percent)}`}>
            {props.hour}t {Math.floor(props.min)}m
          </h1>
        </div>

      </div>
    )
  }

  function liveTrafficBox(title: string, value: number) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg h-52 w-52">
        <div className="flex flex-col pl-2 w-fit h-fit">
          <div className="flex flex-row">
            <p className="text-slate-500 font-semibold">
              {title}
            </p>
            <div className="flex ml-2 mb-1">
              <p className="flex absolute self-end rounded-full animate-ping bg-red-500 font-semibold w-3 h-3" />
              <p className="flex absolute self-end rounded-full bg-red-500 font-semibold w-3 h-3" />
            </div>
          </div>

          <h1 className={`flex pt-12 pl-5 font-semibold drop-shadow-xl text-6xl ${getBusyColorPercent(value)}`}>
            {value}%
          </h1>
        </div>

      </div>
    )
  }

  return (
    <html lang="no">
      <head>
        <meta />
        <title>flykø.no</title>
      </head>

      <body className="h-min-screen bg-slate-900">
        <div className="flex flex-col absolute md:relative md:items-center">

          <Header onClick={() => setFetched(false)} />

          <div className="flex flex-col gap-6">

            {infoTitle()}
            {mainTitle()}

            <div className="flex flex-col md:flex-row gap-8 self-center">

              {searchAirport()}
              {checkButton()}

            </div>
          </div>
          <AnimatePresence>
            {(loading || fetched) &&
              <motion.div initial="hidden" animate="visible" variants={{
                hidden: {
                  y: 20,
                  scale: 0.8,
                  opacity: 0
                },
                visible: {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  transition: {
                    delay: 0.2
                  }
                }
              }}>
                <div className="flex flex-col w-min-screen place-items-center mt-12">
                  <h2 className="flex text-xl gap-2 font-medium font-sans text-slate-600">
                    Et estimat for oppmøtetider på <p className=" flex font-bold">{selectedVenue.name}</p>
                  </h2>
                </div>
              </motion.div>}
          </AnimatePresence>


          <AnimatePresence>
            {loading &&
              <motion.div exit={{
                opacity: 0, transition: {
                  delay: 0.2
                }
              }}>
                {shadowBoxes()}
              </motion.div>
            }
          </AnimatePresence>


          {fetched &&
            <motion.div initial="hidden" animate="visible" variants={{
              hidden: {
                y: 40,
                scale: 0.9,
                opacity: 0
              },
              visible: {
                y: 0,
                scale: 1,
                opacity: 1,
                transition: {
                  delay: 0.4
                }
              }
            }}>
              <StatsDisplay />
            </motion.div>
          }
          <Footer />
        </div >

      </body>
    </html >
  )

  function shadowBoxes() {
    return (
      <div className="flex flex-col px-4 bg-slate-900 mt-12 gap-6 animate-pulse">
        <div className="flex flex-row place-content-between md:flex-row gap-6 ">
          <div className="bg-slate-800 rounded-xl shadow-lg h-52 w-52">
            <div className="flex flex-col pl-2 w-fit h-fit">
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl shadow-lg h-52 w-52">
            <div className="flex flex-col pl-2 w-fit h-fit">
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl shadow-lg h-52 w-52">
            <div className="flex flex-col pl-2 w-fit h-fit">
            </div>
          </div>
        </div>

        <div className="flex w-full h-64 rounded-lg bg-slate-800">

        </div>

      </div>
    )
  }

  function getBusyColorPercent(value: number) {
    if (value <= 50) {
      return "text-green-500"
    }
    if (value <= 65) {
      return "text-yellow-500"
    }
    if (value <= 75) {
      return "text-orange-500"
    }
    if (value <= 90) {
      return "text-red-500"
    }
    if (value <= 100) {
      return "text-red-800"
    }
    else {
      return "text-green-500"
    }
  }

  function getBusyColor(hour: number, min: number, weighted: number) {
    let value = ((hour * 60) + min) * weighted
    if (value <= 60) {
      return "text-green-500"
    }
    if (value <= 90) {
      return "text-yellow-500"
    }
    if (value <= 120) {
      return "text-orange-500"
    }
    if (value <= 180) {
      return "text-red-500"
    }
    if (value > 240) {
      return "text-red-800"
    }
    else {
      return "text-green-500"
    }
  }

  function ChartDayDisplay() {

    return (

      <>
        <div className="my-2">
          <h1 className="text-2xl text-slate-500 font-semibold">
            Fot trafikk:
          </h1>
        </div>

        <div className="flex flex-row max-w-fit self-center p-2 px-4 shadow-lg rounded-xl bg-slate-800 max-h-fit place-items-center mb-12">
          <div className="flex flex-row min-w-fit gap-3 mb-6">
            <AnimatePresence>

              {daily.map((num, index) => (
                <motion.div
                  key={index}
                  initial="hidden" animate="visible" variants={{
                    hidden: {

                      scale: 0.9,
                      opacity: 0
                    },
                    visible: {

                      scale: 1,
                      opacity: 1,
                      transition: {
                        delay: 0.5 + (0.014 * index)
                      }
                    }
                  }}
                >
                  <div key={index} className="flex flex-col-reverse h-56">
                    <div className="bg-blue-500 rounded-t-md w-4 z-40" style={{ height: `${num}%` }} />
                    {((index + 6) == time.hour || (index) == time.hour + 18) &&
                      <div className=" absolute z-50 bg-red-500 rounded-t-md w-4 opacity-60" style={{ height: busyness * 2.3, marginLeft: time.min * 0.475 }} />
                    }

                    <div className="self-end absolute">
                      <h2 className="absolute text-slate-400 font-semibold">
                        {index % 3 == 0 &&
                          getTime(index + 7) + ':00'}

                      </h2>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>

        </div>
      </>
    )
  }

  function addHoursToDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60 * 1000;
    var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);

    return newDateObj;
  }
  // returns number of flights which departs at the passed in date 
  function getFlightsAtHour(hour) {
    let num = 0
    let today = new Date()
    let date1 = addHoursToDate(today, hour)


    allFlights.map((flight, index) => {

      // create the second date, in CET time
      let date2 = new Date(flight.schedule_time._text)

      // if difference is less than 1 hour, add to num
      if ((date2.getTime() - date1.getTime()) / (1000 * 60 * 60) >= 0 && (date2.getTime() - date1.getTime()) / (1000 * 60 * 60) <= 1) {
        num += 1

      }
    })

    return num
  }

  function FlightsDisplay() {
    let today = new Date()

    let flightData = []

    daily.map((value, index) => {
      flightData[index] = getFlightsAtHour((-today.getHours()) + index)
    })

    let maxFlights = Math.max(...flightData)

    return (
      <>
        <div className="my-2">
          <h1 className="text-2xl text-slate-500 font-semibold">
            Fly avganger:
          </h1>
        </div>

        <div className="flex flex-row max-w-fit self-center p-2 px-4 shadow-lg rounded-xl bg-slate-800 max-h-fit place-items-center ">
          <div className="flex flex-row min-w-fit gap-3 mb-6">
            <AnimatePresence>

              {daily.map((num, index) => (
                <motion.div
                  key={index}
                  initial="hidden" animate="visible" variants={{
                    hidden: {

                      scale: 0.9,
                      opacity: 0
                    },
                    visible: {

                      scale: 1,
                      opacity: 1,
                      transition: {
                        delay: 0.5 + (0.014 * index)
                      }
                    }
                  }}
                >
                  <div key={index} className="flex flex-col-reverse h-56">
                    <div className="bg-purple-800 rounded-t-md w-4 z-40" style={{ height: `${flightData[index + 5] * (100 / maxFlights)}%` }} />
                    <div className="self-end absolute">
                      <h2 className="absolute text-slate-400 font-semibold">
                        {index % 3 == 0 &&
                          getTime(index + 7) + ':00'}
                      </h2>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

          </div>

        </div>
      </>
    )
  }

  function getTime(hour) {

    return hour % 24
  }

  function checkButton() {
    return <div className="flex rounded-full shadow-lg p-4 bg-sky-700 place-content-center hover:bg-sky-600 transition-all cursor-pointer " onClick={() => runCheck()}>
      <h2 className="text-xl select-none text-slate-200 text-center place-self-center px-4">
        Sjekk
      </h2>
    </div>
  }

  function searchAirport() {
    return (
      <div>
        <button className="flex peer focus:peer active:peer active:scale-105 transition-all">
          <div className="flex rounded-full shadow-lg p-4 bg-slate-800 place-content-center hover:bg-slate-700 transition-all">

            <svg className="h-6 w-6 text-slate-200" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z" transform="rotate(-15 12 12) translate(0 -1)" />  <line x1="3" y1="21" x2="21" y2="21" /></svg>
            <h2 className="text-xl text-slate-300 text-center place-self-center px-4">
              {selectedVenue.name}
            </h2>
          </div>
        </button>
        <ul className="peer-focus:flex peer-active:flex z-50 hover:flex hidden absolute flex-col mt-2 rounded-xl shadow-lg p-2 bg-slate-800 place-content-center">
          {allVenues.map((ven) => (
            <button onClick={() => (setSelectedVenue(ven), setFetched(false))}>
              <div className="flex mt-2  bg-slate-800 rounded-full p-1 hover:bg-slate-700 active:scale-105 transition-all">
                <h2 className="text-lg text-slate-400 text-start place-self-center px-2">
                  {ven.name}
                </h2>
              </div>
            </button>
          ))}
        </ul>
      </div>
    )
  }

  function mainTitle() {
    return <div className="flex self-center">
      <h2 className="text-3xl font-sans text-slate-200">
        Velg flyplass.
      </h2>
    </div>
  }

  function infoTitle() {
    return <div className="flex self-center mt-24 px-4">
      <h2 className="text-xl font-medium font-sans self-center text-center text-slate-700">
        Se hvor tidlig du bør møte opp på din favoritt flyplass!
      </h2>
    </div>
  }
}


export default HomePage