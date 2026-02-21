import './PanelControl.scss'

import { PanelColors } from "../PanelColors/PanelColors"
import { ExploderButton } from '../ExploderButton/ExploderButton'
import { useCubeActions } from '../../providers/CubeActionsContext'
import { useCamera } from '../../providers/CameraContext'
import SwitchSpace from '../SwitchSpace/SwitchSpace'

export const PanelControl = () => {

    const { isSticking } = useCubeActions();

    const { setSpace } = useCamera();

    return (
        <section className="panel-control">
            <div className='panel-control__left'>
                <SwitchSpace />
            </div>
            <div className='panel-control__right'>
                <PanelColors />
                { isSticking &&  <ExploderButton /> }
            </div>
        </section>
    )
}
