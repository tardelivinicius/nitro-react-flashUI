import { FC } from 'react';
import { ProductTypeEnum } from '../../../../../api';
import { AutoGrid, AutoGridProps } from '../../../../../common';
import { useCatalogContext } from '../../../CatalogContext';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { CatalogGridOfferView } from '../common/CatalogGridOfferView';

interface CatalogItemGridWidgetViewProps extends AutoGridProps
{

}

export const CatalogItemGridWidgetView: FC<CatalogItemGridWidgetViewProps> = props =>
{
    const { columnCount = 5, children = null, ...rest } = props;
    const { currentOffer = null, setCurrentOffer = null, currentPage = null, setPurchaseOptions = null } = useCatalogContext();

    if(!currentPage) return null;

    const selectOffer = (offer: IPurchasableOffer) =>
    {
        offer.activate();

        if(offer.isLazy) return;
        
        setCurrentOffer(offer);

        if(offer.product && (offer.product.productType === ProductTypeEnum.WALL))
        {
            setPurchaseOptions(prevValue =>
            {
                const newValue = { ...prevValue };
    
                newValue.extraData = (offer.product.extraParam || null);
    
                return newValue;
            });
        }
    }

    return (
        <AutoGrid columnCount={ columnCount } { ...rest }>
            { currentPage.offers && (currentPage.offers.length > 0) && currentPage.offers.map((offer, index) => <CatalogGridOfferView key={ index } itemActive={ (currentOffer && (currentOffer.offerId === offer.offerId)) } offer={ offer } onClick={ event => selectOffer(offer) } />) }
            { children }
        </AutoGrid>
    );
}
