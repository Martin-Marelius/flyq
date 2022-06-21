import Footer from "../components/footer/Footer"
import Header from "../components/header/Header"
import Link from "next/link"
import Image from "next/image"
import { github, linkedin } from "../assets"

import { useState } from "react"

const Contact = () => {
    return (
        <body className="h-min-screen bg-slate-900">
            <div className="flex flex-col">
                <Header onClick={() => <Link href={'/'} />} />
                <Information />
                <div className="-mt-64 md:-mt-56">
                    <Footer />
                </div>

            </div>
        </body>
    )
}

const Information = () => {
    return (
        <div className="flex flex-col w-screen mt-32 px-8 gap-6 md:w-96 lg:w-1/2 xl:w-1/3 md:self-center">
            <h1 className="text-slate-500 font-semibold text-2xl">
                Ta kontakt
            </h1>

            <ContactForm />
            
            <h2 className="text-slate-500 self-center font-semibold text-2xl">
                Links:
            </h2>
            <div className="flex flex-row gap-6 self-center mb-12">
                <a href={'https://www.linkedin.com/in/martin-marelius-johnsen-3975731a6/'}>
                    <Image src={linkedin} width={48} height={48} />
                </a>

                <a href={'https://github.com/martin-marelius'}>
                    <Image src={github} width={48} height={48} />
                </a>
            </div>

        </div>
    )
}

const ContactForm = () => {

    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = () => {
      setTimeout(() => {
        setSubmitted(true);
      }, 100);
    };
  
    if (submitted) {
      return (
        <>
          <div className="text-2xl">Tusen takk!</div>
          <div className="text-md">Jeg tar kontakt så fort som mulig.</div>
        </>
      );
    }
  
    return (
      <form
        action={''}
        onSubmit={handleSubmit}
        method="POST"
        target="_blank"
      >
        <div className="mb-3 pt-0">
          <input
            type="text"
            placeholder="Navn"
            name="name"
            className="px-3 py-3 placeholder-slate-600 text-slate-400 relative bg-slate-800 rounded-lg text-sm border-0 shadow-lg outline-none focus:outline-none focus:ring w-full"
            required
          />
        </div>
        <div className="mb-3 pt-0">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="px-3 py-3 placeholder-slate-600 text-slate-400 relative bg-slate-800 rounded-lg text-sm border-0 shadow-lg outline-none focus:outline-none focus:ring w-full"
            required
          />
        </div>
        <div className="mb-3 pt-0">
          <textarea
            placeholder="Din melding"
            name="message"
            className="px-3 py-3 placeholder-slate-600 text-slate-400 relative bg-slate-800 rounded-lg text-sm border-0 shadow-lg outline-none focus:outline-none focus:ring w-full"
            required
          />
        </div>
        <div className="mb-3 pt-0">
          <button
            className="bg-slate-700 text-slate-300 active:bg-slate-600 font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 transition-all"
            type="submit">
            Send
          </button>
        </div>
      </form>
    );
  };
  


export default Contact