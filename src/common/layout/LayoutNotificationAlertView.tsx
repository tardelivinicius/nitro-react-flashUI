import { FC, useMemo } from 'react';
import { NotificationAlertType } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView, NitroCardViewProps } from '../card';

export interface LayoutNotificationAlertViewProps extends NitroCardViewProps
{
    title?: string;
    type?: string;
    close: () => void;
}

export const LayoutNotificationAlertView: FC<LayoutNotificationAlertViewProps> = props =>
{
    const { title = '', close = null, classNames = [], children = null,type = NotificationAlertType.DEFAULT, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-alert' ];
        
        newClassNames.push('nitro-alert-' + type);

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames, type ]);

    return (
        <NitroCardView classNames={ getClassNames } { ...rest }>
            <NitroCardHeaderView headerText={ title } onCloseClick={ close } />
            <NitroCardContentView grow justifyContent="between" overflow="hidden" className="text-black" gap={0}>
                { children }
            </NitroCardContentView>
        </NitroCardView>
    );
}
