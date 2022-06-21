import Link from "next/link"
import React, { Children, useEffect, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"

import venues from "../utils/venues"
import { venue } from "../utils/venues"

import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"


function HomePage() {

  const [data, setData] = useState()
  const [venue, setVenue] = useState<venue>()

  const [time, setTime] = useState({ hour: 0, min: 0 })

  // displayed data hourly
  const [busyness, setBusyness] = useState(0)
  const [expected, setExpected] = useState(0)
  const [checkin, setCheckin] = useState({ hour: 0, min: 0 })
  const [checkinIntl, setCheckinIntl] = useState({ hour: 0, min: 0 })

  // daily flights and airport size
  const [flights, setFlights] = useState(0)
  const [airportSize, setAirportSize] = useState(0)

  // displayed data weekly
  const [weekly, setWeekly] = useState([])
  const [daily, setDaily] = useState([])

  const [loading, isLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const runCheck = async (id: venue) => {
    if (fetched) return

    // set the current time
    let now = new Date()
    setTime({ hour: now.getHours(), min: now.getMinutes() })

    isLoading(true)

    await fetchLiveData()
    await fetchWeekData()
    await fetchDayData()
    await flightsData()
    await fetchAirportSize()

    calculateCheckIn()

    isLoading(false)

    setFetched(true)
  }

  useEffect(() => {
    calculateCheckIn()
  }, [fetched])


  const calculateCheckIn = () => {

    let min = (30 + (busyness / 2) - (busyness - expected)) * (1 + (flights / airportSize))
    setCheckin({ hour: Math.floor(min / 60), min: min % 60 })

    let minInt = (50 + (busyness) - (busyness - expected)) * (1 + (flights / airportSize))
    setCheckinIntl({ hour: Math.floor(minInt / 60), min: minInt % 60 })
  }

  async function flightsData() {
    const options = {
      method: "GET",
      url: "https://flightqdb.herokuapp.com/incoming_departures"
    }

    await axios.request(options).then((response) => {
      let size = Object.keys(response.data['airport']['flights']['flight']).length
      setFlights(size)
    })

  }

  async function fetchAirportSize() {
    const options = {
      method: "GET",
      url: "https://flightqdb.herokuapp.com/airport_size"
    }

    await axios.request(options).then((response) => {
      let size = Object.keys(response.data['airport']['flights']['flight']).length
      setAirportSize(size)
    })

  }

  async function fetchLiveData() {

    const options = {
      method: 'GET',
      url: 'https://flightqdb.herokuapp.com/livedata'
    }

    await axios.request(options).then((response) => {
      setBusyness((response.data['analysis']['venue_live_busyness'] + response.data['analysis']['venue_forecasted_busyness']) / 2)
      setExpected(response.data['analysis']['venue_forecasted_busyness'])
    })

  }

  async function fetchDayData() {

    const options = {
      method: 'GET',
      url: 'https://flightqdb.herokuapp.com/dayaverages'
    }

    await axios.request(options).then((response) => {
      setDaily(response.data['analysis']['day_raw'])

    })

  }

  async function fetchWeekData() {

    const options = {
      method: 'GET',
      url: 'https://flightqdb.herokuapp.com/weekaverages'
    }

    await axios.request(options).then((response) => {
      setWeekly(response.data['analysis']['week_overview'])

    })

  }

  return (
    <html lang="no">
      <head>
        <meta />
        <title>flykø.no</title>
      </head>

      <body className="h-min-screen bg-slate-900">
        <div className="flex flex-col absolute md:relative md:items-center">

          <Header onClick={() => setFetched(false)}/>
          
          <div className="flex flex-col gap-6">

            {infoTitle()}
            {mainTitle()}

            <div className="flex flex-col md:flex-row gap-8 self-center">

              {chooseAirport()}
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
                    Et estimat for check-in tid på <p className=" flex font-bold">Gardermoen Lufthavn</p>
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
              {statsDisplay()}
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

  function statsDisplay(): React.ReactNode {
    return <div className={`flex flex-col px-4 bg-slate-900 mt-12 gap-6 ${fetched ? "" : "hidden"}`}>


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
          {checkInBox("Check-in innland:", checkin.hour, checkin.min, 1)}
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
          {checkInBox("Check-in utland:", checkinIntl.hour, checkinIntl.min, 0.6)}
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
      </motion.div>
    </div>

    function checkInBox(title: string, hour: number, min: number, percent: number) {
      return (
        <div className="bg-slate-800 rounded-xl shadow-lg h-52 w-52">
          <div className="flex flex-col pl-2 w-fit h-fit">
            <p className="text-slate-500 font-semibold">
              {title}

            </p>
            <h1 className={`flex pt-12 pl-5 font-semibold drop-shadow-xl text-5xl ${getBusyColor(hour, min, percent)}`}>
              {hour}t {Math.floor(min)}m
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

  /**
 * The data display of the waiting time
 */
  function dataDisplay() {
    let waitingTime = 4
    let airport = "Gardermoen"
    return (
      <div className="flex flex-col self-center place-content-center gap-6 mt-24">
        <div className="flex flex-row">
          <p className=" flex place-items-center gap-2 text-2xl text-slate-200">
            Anslått check-in tid på
            <h1 className="text-2xl font-semibold">{airport} Lufthavn</h1>
          </p>
        </div>
        <div className="flex flex-row gap-4 place-content-center">
          <h1 className="text-6xl font-semibold text-red-300">{waitingTime}</h1>
          <h2 className=" flex place-items-end gap-2 text-2xl text-slate-200">timer</h2>
        </div>
      </div>
    )
  }

  function ChartDayDisplay() {

    return (
      <div className="flex flex-row max-w-fit self-center p-2 px-4 shadow-lg rounded-xl bg-slate-800 max-h-fit place-items-center mb-24">
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
                  {(index + 6) == time.hour &&
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

    )
  }

  function ChartWeekDisplay() {

    return (
      <div className="flex flex-row p-2 px-4 shadow-lg rounded-xl bg-slate-800 max-w-fit max-h-fit place-items-center">
        <div className="flex flex-row self-end gap-3 mb-6">
          {weekly.map((day_mean, index) => (
            <div className="flex flex-row">
              <div key={index} className="flex flex-col place-content-end h-56">
                <div className="bg-blue-500 rounded-t-md w-12" style={{ height: `${day_mean}%` }} />
              </div>

              <div className="self-end">
                <h2 className="absolute text-slate-400 font-semibold">
                  {index % 3 == 0 &&
                    getTime(time.hour - 10) + ':00'}

                </h2>
              </div>

            </div>)
          )}

        </div>
      </div>

    )
  }

  function getTime(hour) {

    return hour % 24
  }

  // <div className="flex absolute w-6 rounded-t-md shadow-xl bg-red-500" style={{ marginLeft: (time.min * 0.4) + (60 * 0.4), height: liveBusyness * 1.82, marginBottom: 24 }} />

  function checkButton() {
    return <div className="flex rounded-full shadow-lg p-4 bg-sky-700 place-content-center hover:bg-sky-600 transition-all cursor-pointer " onClick={() => runCheck(null)}>
      <h2 className="text-xl select-none text-slate-200 text-center place-self-center px-4">
        Sjekk
      </h2>
    </div>
  }

  function chooseAirport() {
    return <div className="flex rounded-full shadow-lg p-4 bg-slate-800 place-content-center hover:bg-slate-700 transition-all">
      <svg className="h-6 w-6 text-slate-200" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z" transform="rotate(-15 12 12) translate(0 -1)" />  <line x1="3" y1="21" x2="21" y2="21" /></svg>
      <h2 className="text-xl text-slate-300 text-center place-self-center px-4">
        Gardermoen Lufthavn
      </h2>
    </div>
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
        Se hvor lang check-in tid det er på flyplassen du skal på.
      </h2>
    </div>
  }

  function logoDisplay() {
    return <div className="flex p-6 self-start select-none absolute">
      <Link href="/">
        <h1 className="flex text-5xl text-slate-200 font-sans cursor-pointer" onClick={() => setFetched(false)}>

          fly<h1 className="font-semibold text-sky-400">kø</h1>.no

        </h1>
      </Link>
    </div>
  }
}


export default HomePage