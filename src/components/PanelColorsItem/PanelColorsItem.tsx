import { useCubeColor } from '../../providers/CubeColorContext';
import './PanelColorsItem.scss'

type Props = {
    color: string,
    borderColor: string,
}

const PanelColorsItem: React.FC<Props> = ({ color, borderColor }) => {
  const { setColorCube, setBorderCube } = useCubeColor();

  return (
    <li onClick={(e: any) => e.stopPropagation()} style={{ backgroundColor: color, borderColor: borderColor }} className='panel-control__item'>
        <button onClick={() => { setColorCube(color), setBorderCube(borderColor) }} className="panel-control__item-btn" ></button>
    </li>
  )
}

export default PanelColorsItem
