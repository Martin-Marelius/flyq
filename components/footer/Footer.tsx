

const Footer = () => {
    return (
        <div className="flex flex-col mt-96 md:mt-44 place-content-center justify-self-end md:w-screen md:place-items-center md:self-center">
            <hr className="my-6 sm:mx-auto border-slate-700 lg:my-8" />
            <div className="flex items-center justify-between ml-6 md:gap-12">
                <a href="https://flyq.no" className="flex items-center mb-6">
                    <span className="self-center text-3xl font-normal whitespace-nowrap text-slate-200">fly<span className="text-sky-400">q</span>.no</span>
                </a>
                <ul className="flex flex-wrap items-center mb-6 text-md gap-2 text-slate-400">
                    <li>
                        <a href="/about" className="mr-4 hover:underline">Om</a>
                    </li>
                    <li>
                        <a href="/contact" className="mr-6 hover:underline">Kontakt</a>
                    </li>
                </ul>
            </div>
            <span className="block text-sm mb-4 text-center text-slate-500">© 2022 <a className="hover:underline">flyq</a> - Martin Marelius
            </span>


        </div>
    )
}

export default Footer