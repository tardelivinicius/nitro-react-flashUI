import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { LocalizeText } from '../../../../../api';
import { Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

const MIN_VALUE: number = 1;
const MAX_VALUE: number = 100;

export const CatalogSpinnerWidgetView: FC<{}> = props =>
{
    const { currentOffer = null, purchaseOptions = null, setPurchaseOptions = null } = useCatalog();
    const { quantity = 1 } = purchaseOptions;

    const updateQuantity = (value: number) =>
    {
        if(isNaN(value)) value = 1;

        value = Math.max(value, MIN_VALUE);
        value = Math.min(value, MAX_VALUE);

        if(value === quantity) return;

        setPurchaseOptions(prevValue =>
        {
            const newValue = { ...prevValue };

            newValue.quantity = value;

            return newValue;
        });
    }

    if(!currentOffer || !currentOffer.bundlePurchaseAllowed) return null;

    return (
        <>
            <Text>{ LocalizeText('catalog.bundlewidget.spinner.select.amount') }</Text>
            <Flex alignItems="center" gap={ 1 }>
                <input type="number" className="form-control form-control-sm quantity-input" value={ quantity } onChange={ event => updateQuantity(event.target.valueAsNumber) } />
            </Flex>
        </>
    );
}
