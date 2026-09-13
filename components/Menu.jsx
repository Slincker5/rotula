import Link from 'next/link'
const Menu = () => {
    return (
        <header className='px-4 py-6 bg-white flex items-center justify-between border-b-[#c9c9c9] border-b sticky top-0 z-50'>
            <h1 className='font-bold'>
                ROTULA<span className='text-orange-500'>.APP</span>
            </h1>
            <div>
                <Link href="/login" className='bg-black px-4 py-2 text-white rounded-xl mr-4'>Iniciar sesion</Link>
                <Link href="/registro" className='bg-black px-4 py-2 text-white rounded-xl'>Registrate</Link>
            </div>
        </header>
    )
}

export default Menu;