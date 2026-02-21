import './ExploderButton.scss'

import { useCubeActions } from "../../providers/CubeActionsContext";

export const ExploderButton = () => {
    const { explode } = useCubeActions();

    return (
        <button
            className="exploder-btn"
            onClick={explode}
        >
            Разъединить
        </button>
    )
}