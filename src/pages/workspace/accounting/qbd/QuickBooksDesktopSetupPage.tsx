import type {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Computer from '@assets/images/computer.svg';
import Button from '@components/Button';
import CopyTextToClipboard from '@components/CopyTextToClipboard';
import FixedFooter from '@components/FixedFooter';
import FullScreenLoadingIndicator from '@components/FullscreenLoadingIndicator';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ImageSVG from '@components/ImageSVG';
import ScreenWrapper from '@components/ScreenWrapper';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import * as QuickBooksDesktop from '@libs/actions/connections/QuickBooksDesktop';
import Navigation from '@libs/Navigation/Navigation';
import type {SettingsNavigatorParamList} from '@libs/Navigation/types';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';

type RequireQuickBooksDesktopModalProps = StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.ACCOUNTING.QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL>;

function RequireQuickBooksDesktopModal({route}: RequireQuickBooksDesktopModalProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const policyID: string = route.params.policyID;
    const [isLoading, setIsLoading] = useState(true);
    const [codatSetupLink, setCodatSetupLink] = useState<string>('');

    useEffect(() => {
        const fetchSetupLink = () => {
            // eslint-disable-next-line rulesdir/no-thenable-actions-in-views
            QuickBooksDesktop.getQuickbooksDesktopCodatSetupLink(policyID).then((response) => {
                setCodatSetupLink(String(response?.setupUrl ?? ''));
                setIsLoading(false);
            });
        };

        fetchSetupLink();
    }, []);

    if (isLoading) {
        return <FullScreenLoadingIndicator />;
    }

    return (
        <ScreenWrapper
            shouldEnablePickerAvoiding={false}
            shouldShowOfflineIndicatorInWideScreen
            testID={RequireQuickBooksDesktopModal.displayName}
        >
            <HeaderWithBackButton
                title={translate('workspace.qbd.qbdSetup')}
                shouldShowBackButton
                onBackButtonPress={() => Navigation.dismissModal()}
            />
            <View style={[styles.flex1, styles.ph6]}>
                <View style={[styles.alignSelfCenter, styles.computerIllustrationContainer]}>
                    <ImageSVG src={Computer} />
                </View>

                <Text style={[styles.textHeadlineH1, styles.pt5]}>{translate('workspace.qbd.setupPage.title')}</Text>
                <Text style={[styles.textSupporting, styles.textNormal, styles.pt4]}>{translate('workspace.qbd.setupPage.body')}</Text>
                <View style={[styles.qbdSetupLinkBox, styles.mt5]}>
                    <CopyTextToClipboard
                        text={codatSetupLink}
                        textStyles={[styles.colorMuted]}
                    />
                </View>
                <FixedFooter style={[styles.mtAuto]}>
                    <Button
                        success
                        text={translate('common.done')}
                        onPress={() => Navigation.navigate(ROUTES.WORKSPACE_ACCOUNTING.getRoute(policyID))}
                        pressOnEnter
                        large
                    />
                </FixedFooter>
            </View>
        </ScreenWrapper>
    );
}

RequireQuickBooksDesktopModal.displayName = 'RequireQuickBooksDesktopModal';

export default RequireQuickBooksDesktopModal;
