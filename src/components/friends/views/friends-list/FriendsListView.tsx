import { ILinkEventTracker, RemoveFriendComposer, SendRoomInviteComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AddEventLinkTracker, LocalizeText, MessengerFriend, RemoveLinkEventTracker, SendMessageComposer } from '../../../../api';
import { Flex, NitroCardAccordionSetView, NitroCardAccordionView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { NitroCardAccordionSetInnerView } from '../../../../common/card/accordion/NitroCardAccordionSetInnerView';
import { useFriends } from '../../../../hooks';
import { FriendsListGroupView } from './friends-list-group/FriendsListGroupView';
import { FriendsListRequestView } from './friends-list-request/FriendsListRequestView';
import { FriendsRemoveConfirmationView } from './FriendsListRemoveConfirmationView';
import { FriendsRoomInviteView } from './FriendsListRoomInviteView';
import { FriendsSearchView } from './FriendsListSearchView';

export const FriendsListView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const [ selectedFriendsIds, setSelectedFriendsIds ] = useState<number[]>([]);
    const [ showRoomInvite, setShowRoomInvite ] = useState<boolean>(false);
    const [ showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation ] = useState<boolean>(false);
    const { onlineFriends = [], offlineFriends = [], requests = [], requestFriend = null } = useFriends();

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
        if(!selectedFriendsIds.length || !message || !message.length || (message.length > 255)) return;
        
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

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'request':
                        if(parts.length < 4) return;

                        requestFriend(parseInt(parts[2]), parts[3]);
                }
            },
            eventUrlPrefix: 'friends/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ requestFriend ]);

    if(!isVisible) return null;

    return (
        <>
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends" theme="friendlist">
                <NitroCardHeaderView headerText={ LocalizeText('friendlist.friends') } onCloseClick={ event => setIsVisible(false) } />
                <NitroCardContentView overflow="hidden" gap={ 1 } className="text-black p-0">
                    <NitroCardAccordionView fullHeight overflow="hidden">
                        <NitroCardAccordionSetView className="friend-headers" headerText={ LocalizeText('friendlist.friends') } isExpanded={ true }>
                            <NitroCardAccordionSetInnerView headerText={ LocalizeText('friendlist.friends') + ` (${ onlineFriends.length })` } isExpanded={ true }>
                                <FriendsListGroupView list={ onlineFriends } selectedFriendsIds={ selectedFriendsIds } selectFriend={ selectFriend } />
                            </NitroCardAccordionSetInnerView>
                            <NitroCardAccordionSetInnerView headerText={ LocalizeText('friendlist.friends.offlinecaption') + ` (${ offlineFriends.length })` } isExpanded={ true }>
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
                        <FriendsListRequestView className="friend-headers" headerText={ LocalizeText('friendlist.tab.friendrequests') + ` (${ requests.length })` } isExpanded={ false } />
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
