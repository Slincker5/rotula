const Cargando = ({ texto }) => {
return (
    <div className="bg-blue-950/80 w-full h-full fixed top-0 left-0 flex items-center justify-center text-white text-lg z-50">
        <p>
            <i className="fa-jelly-duo fa-regular fa-hourglass fa-flip-360"></i>Cargando...<br />
            {texto}
        </p>
    </div>
)
}

export default Cargando