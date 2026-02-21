import './SwitchSpace.scss'
import { useCamera } from '../../providers/CameraContext'

const SwitchSpace = () => {
    const { setSpace, space } = useCamera();

    return (
        <button onClick={() => setSpace(space === '2D' ? '3D' : '2D')} className='switch-space'>
            { space === '2D' ? '2D' : '3D' }
        </button>
    )
}

export default SwitchSpace
