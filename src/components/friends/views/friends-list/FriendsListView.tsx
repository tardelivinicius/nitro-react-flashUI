import { RemoveFriendComposer, SendRoomInviteComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Flex, NitroCardAccordionSetView, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { NitroCardAccordionSetInnerView } from '../../../../common/card/accordion/NitroCardAccordionSetInnerView';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerRequest } from '../../common/MessengerRequest';
import { FriendsListGroupView } from './friends-list-group/FriendsListGroupView';
import { FriendsListRequestView } from './friends-list-request/FriendsListRequestView';
import { FriendsRemoveConfirmationView } from './FriendsRemoveConfirmationView';
import { FriendsRoomInviteView } from './FriendsRoomInviteView';
import { FriendsSearchView } from './FriendsSearchView';

interface FriendsListViewProps
{
    onCloseClick: () => void;
    onlineFriends: MessengerFriend[];
    offlineFriends: MessengerFriend[];
    friendRequests: MessengerRequest[];
}

export const FriendsListView: FC<FriendsListViewProps> = props =>
{
    const { onlineFriends = [], offlineFriends = [], friendRequests = [], onCloseClick = null } = props;
    const [ selectedFriendsIds, setSelectedFriendsIds ] = useState<number[]>([]);
    const [ showRoomInvite, setShowRoomInvite ] = useState<boolean>(false);
    const [ showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation ] = useState<boolean>(false);

    const removeFriendsText = useMemo(() =>
    {
        if(!selectedFriendsIds || !selectedFriendsIds.length) return '';

        const userNames: string[] = [];

        for(const userId of selectedFriendsIds)
        {
            let existingFriend: MessengerFriend = onlineFriends.find(f => f.id === userId);

            if(!existingFriend) existingFriend = offlineFriends.find(f => f.id === userId);

            if(!existingFriend) continue;

            userNames.push(existingFriend.name);
        }

        return LocalizeText('friendlist.removefriendconfirm.userlist', [ 'user_names' ], [ userNames.join(', ') ]);
    }, [ offlineFriends, onlineFriends, selectedFriendsIds ]);

    const selectFriend = useCallback((userId: number) =>
    {
        if(userId < 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const existingUserIdIndex: number = newValue.indexOf(userId);

            if(existingUserIdIndex > -1)
            {
                newValue.splice(existingUserIdIndex, 1)
            }
            else
            {
                newValue.push(userId);
            }

            return newValue;
        });
    }, [ setSelectedFriendsIds ]);

    const sendRoomInvite = (message: string) =>
    {
        if(selectedFriendsIds.length === 0 || !message || message.length === 0) return;
        
        SendMessageComposer(new SendRoomInviteComposer(message, selectedFriendsIds));
        setShowRoomInvite(false);
    }

    const removeSelectedFriends = () =>
    {
        if(selectedFriendsIds.length === 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            SendMessageComposer(new RemoveFriendComposer(...prevValue));

            return [];
        });

        setShowRemoveFriendsConfirmation(false);
    }

    return (
        <>
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends" theme="friendlist">
                <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ onCloseClick } />
                <NitroCardContentView overflow="hidden" gap={ 1 } className="text-black p-0">
                    <NitroCardAccordionView fullHeight overflow="hidden">
                        <NitroCardAccordionSetView className="friend-headers" headerText={ LocalizeText('friendlist.friends')} isExpanded={ true }>
                        <NitroCardAccordionSetInnerView headerText={ LocalizeText('friendlist.friends') + ` (${onlineFriends.length})` } isExpanded={ true }>
                            <FriendsListGroupView list={ onlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                        </NitroCardAccordionSetInnerView>
                        <NitroCardAccordionSetInnerView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${offlineFriends.length})` } isExpanded={ true }>
                            <FriendsListGroupView list={ offlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                        </NitroCardAccordionSetInnerView>
                        { selectedFriendsIds && selectedFriendsIds.length === 0 &&
                        <Flex gap={ 1 } className="friend-active-tab p-1">
                            <div className="friend-follow-icon" />
                            <div className="friend-profile-icon" />
                            <div className="friend-delete-icon" />
                        </Flex> } 
                        { selectedFriendsIds && selectedFriendsIds.length > 0 &&
                        <Flex gap={ 1 } className="friend-active-tab p-1">
                            <div className="friend-follow-icon active" onClick={ () => setShowRoomInvite(true) } />
                            <div className="friend-profile-icon active" />
                            <div className="friend-delete-icon active" onClick={ event => setShowRemoveFriendsConfirmation(true) } />
                        </Flex> } 
                        </NitroCardAccordionSetView>
                        <FriendsListRequestView className="friend-req-headers" headerText={ LocalizeText('friendlist.tab.friendrequests') + ` (${ friendRequests.length })` } requests={ friendRequests } />
                        <FriendsSearchView className="search-headers" headerText={ LocalizeText('people.search.title') } />
                    </NitroCardAccordionView>
                </NitroCardContentView>
                <div className="friendlist-bottom p-1"></div>
            </NitroCardView>
            { showRoomInvite &&
                <FriendsRoomInviteView selectedFriendsIds={ selectedFriendsIds } onCloseClick={ () => setShowRoomInvite(false) } sendRoomInvite={ sendRoomInvite } /> }
            { showRemoveFriendsConfirmation && 
                <FriendsRemoveConfirmationView selectedFriendsIds={ selectedFriendsIds } removeFriendsText={ removeFriendsText } onCloseClick={ () => setShowRemoveFriendsConfirmation(false) } removeSelectedFriends={ removeSelectedFriends } /> }
        </>
    );
};
