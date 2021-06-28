import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../utils/LocalizeText';
import { useWiredContext } from '../../../context/WiredContext';
import { WiredFurniType } from '../../../WiredView.types';
import { WiredActionBaseView } from '../base/WiredActionBaseView';

export const WiredActionSetFurniStateToView: FC<{}> = props =>
{
    const [ stateFlag, setStateFlag ] = useState(-1);
    const [ directionFlag, setDirectionFlag ] = useState(-1);
    const [ positionFlag, setPositionFlag ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    useEffect(() =>
    {
        setStateFlag(trigger.getBoolean(0) ? 1 : 0);
        setDirectionFlag(trigger.getBoolean(1) ? 1 : 0);
        setPositionFlag(trigger.getBoolean(2) ? 1 : 0);
    }, [ trigger ]);

    const save = useCallback(() =>
    {
        setIntParams([stateFlag, directionFlag, positionFlag]);
    }, [ directionFlag, positionFlag, setIntParams, stateFlag ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType._Str_4873 } save={ save }>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="stateFlag" onChange={(e) => setStateFlag(e.target.checked ? 1 : 0)} />
                <label className="form-check-label" htmlFor="stateFlag">
                    { LocalizeText('wiredfurni.params.condition.state') }
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="directionFlag" onChange={(e) => setDirectionFlag(e.target.checked ? 1 : 0)} />
                <label className="form-check-label" htmlFor="directionFlag">
                    { LocalizeText('wiredfurni.params.condition.direction') }
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="positionFlag" onChange={(e) => setPositionFlag(e.target.checked ? 1 : 0)} />
                <label className="form-check-label" htmlFor="positionFlag">
                    { LocalizeText('wiredfurni.params.condition.position') }
                </label>
            </div>
        </WiredActionBaseView>
    );
}
