import { FC } from 'react';
import { Grid, GridProps } from '../../../../../common/Grid';
import { CatalogSetExtraPurchaseParameterEvent } from '../../../../../events';
import { dispatchUiEvent } from '../../../../../hooks';
import { useCatalogContext } from '../../../CatalogContext';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { ProductTypeEnum } from '../../../common/ProductTypeEnum';
import { CatalogGridOfferView } from '../common/CatalogGridOfferView';

interface CatalogItemGridWidgetViewProps extends GridProps
{

}

export const CatalogItemGridWidgetView: FC<CatalogItemGridWidgetViewProps> = props =>
{
    const { children = null, ...rest } = props;
    const { currentOffer = null, setCurrentOffer = null, currentPage = null } = useCatalogContext();

    if(!currentPage) return null;

    const selectOffer = (offer: IPurchasableOffer) =>
    {
        setCurrentOffer(offer);

        if(offer.product && (offer.product.productType === ProductTypeEnum.WALL))
        {
            dispatchUiEvent(new CatalogSetExtraPurchaseParameterEvent(offer.product.extraParam));
        }
    }

    return (
        <Grid grow columnCount={ 5 } overflow="auto" { ...rest }>
            { currentPage.offers && (currentPage.offers.length > 0) && currentPage.offers.map((offer, index) =>
            {
                return <CatalogGridOfferView key={ index } itemActive={ (currentOffer && (currentOffer.offerId === offer.offerId)) } offer={ offer } onClick={ event => selectOffer(offer) } />;
            }) }
            { children }
        </Grid>
    );
}
