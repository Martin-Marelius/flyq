import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"
import Link from "next/link"

const About = () => {
    return (
        <body className="h-min-screen bg-slate-900">
            <div className="flex flex-col">
                <Header onClick={() => <Link href={'/'} />} />
                <Information />
                <div className="-mt-20">
                    <Footer />
                </div>

            </div>
        </body>
    )
}

const Information = () => {
    return (
        <div className="flex flex-col w-screen mt-32 px-8 gap-4  md:w-1/2 xl:w-1/3 md:self-center">
            <h1 className="text-slate-500 font-semibold text-2xl">
                Hvordan funker det?
            </h1>

            <p className="whitespace-pre-wrap font-normal text-slate-500 text-lg">
                Flyq.no er en nettside som viser deg hvor travel en flyplass er i sanntid.

            </p>

            <p className="whitespace-pre-wrap font-normal text-slate-500 text-lg">
                Nettsiden bruker informasjon fra offentlig tilgjengelige API'er for å kalkulere et estimat over hvor tidlig du må være på flyplassen, for å rekke flyet ditt.
            </p>

            <p className="whitespace-pre-wrap font-normal text-slate-500 text-lg">
                <span className="font-semibold">NB!</span> Alltid dra i god tid til flyplassen, spesielt i den travle tiden mellom 12:00-16:00.
                Flyq.no står ikke ansvarlig om du under noen omstendigheter skulle komme forseint til flyet ditt.
            </p>
        </div>
    )
}

export default About