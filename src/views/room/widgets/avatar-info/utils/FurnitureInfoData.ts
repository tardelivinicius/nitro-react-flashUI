import { IObjectData } from 'nitro-renderer';

export class FurnitureInfoData
{
    constructor(
        public id: number = 0,
        public category: number = 0,
        public name: string = '',
        public description: string = '',
        public image: HTMLImageElement = null,
        public isWallItem: boolean = false,
        public isStickie: boolean = false,
        public isRoomOwner: boolean = false,
        public roomControllerLevel: number = 0,
        public isAnyRoomController: boolean = false,
        public expiration: number = -1,
        public purchaseCatalogPageId: number = -1,
        public purchaseOfferId: number = -1,
        public extraParam: string = '',
        public isOwner: boolean = false,
        public stuffData: IObjectData = null,
        public groupId: number = 0,
        public ownerId: number = 0,
        public ownerName: string = '',
        public usagePolicy: number = 0,
        public rentCatalogPageId: number = -1,
        public rentOfferId: number = -1,
        public purchaseCouldBeUsedForBuyout: boolean = false,
        public rentCouldBeUsedForBuyout: boolean = false,
        public availableForBuildersClub: boolean = false) {}
}
