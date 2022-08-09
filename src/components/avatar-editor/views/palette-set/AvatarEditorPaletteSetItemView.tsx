import { FC, useCallback, useEffect, useState } from 'react';
import { AvatarEditorGridColorItem, GetConfiguration } from '../../../../api';
import { LayoutCurrencyIcon, LayoutGridItem, LayoutGridItemProps } from '../../../../common';

export interface AvatarEditorPaletteSetItemProps extends LayoutGridItemProps
{
    colorItem: AvatarEditorGridColorItem;
}

export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = props =>
{
    const { colorItem = null, children = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const hcDisabled = GetConfiguration<boolean>('hc.disabled', false);

    const rerender = useCallback(() =>
    {
        setUpdateId(prevValue => (prevValue + 1));
    }, []);

    useEffect(() =>
    {
        colorItem.notify = rerender;

        return () => colorItem.notify = null;
    });

    return (
        <LayoutGridColorPickerItem itemHighlight itemColor={ colorItem.color } itemActive={ colorItem.isSelected } className="color-picker-frame clear-bg" { ...rest }>
            { !hcDisabled && colorItem.isHC && <i className="icon hc-icon position-absolute" /> }
            { children }
        </LayoutGridColorPickerItem>
    );
}
