import PanelColorsItem from '../PanelColorsItem/PanelColorsItem'
import { Color, colors } from './data/colors'
import './PanelColors.scss'

export const PanelColors = () => {
  return (
    <section className="panel-colors">
        <span className="panel-colors__title">Выбери цвет</span>

        <ul className="panel-colors__items">
        {
          colors && colors.map((item: Color) => {
            return <PanelColorsItem key={item.id} color={item.color} borderColor={item.borderColor} />               
          })
        }
        </ul>
    </section>
  )
}