import Link from "next/link"


const Header = (props) => {
    return (
        <div className="flex p-6 self-start select-none absolute">
            <Link href="/">
                <h1 className="flex text-5xl text-slate-200 font-sans cursor-pointer" onClick={() => props.onClick()}>

                    fly<h1 className="font-semibold text-sky-400">q</h1>.no

                </h1>
            </Link>
        </div>
    )
}

export default Header