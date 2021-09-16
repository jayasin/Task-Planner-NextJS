import spinner from '../../assest/buffer.gif'
import Image from 'next/image'


const Loader = () => {
    return (
        <div className="loader">
            <div className="spinner">
            <Image src={spinner} alt="loader"/>
            </div>
        </div>
    )
}

export default Loader
