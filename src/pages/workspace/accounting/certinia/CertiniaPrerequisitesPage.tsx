import React from 'react';
import Button from '@components/Button';
import FixedFooter from '@components/FixedFooter';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import ScrollView from '@components/ScrollView';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import {connectPolicyToFinancialForce} from '@libs/actions/connections/FinancialForce';
import Navigation from '@libs/Navigation/Navigation';
import type {PlatformStackScreenProps} from '@libs/Navigation/PlatformStackNavigation/types';
import type {SettingsNavigatorParamList} from '@libs/Navigation/types';
import SCREENS from '@src/SCREENS';

type CertiniaPrerequisitesPageProps = PlatformStackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.ACCOUNTING.CERTINIA_PREREQUISITES>;

function CertiniaPrerequisitesPage({route}: CertiniaPrerequisitesPageProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const policyID: string = route.params.policyID;
    const isSandbox = route.params.isSandbox === 'true';

    return (
        <ScreenWrapper
            shouldEnablePickerAvoiding={false}
            shouldShowOfflineIndicatorInWideScreen
            testID="CertiniaPrerequisitesPage"
            enableEdgeToEdgeBottomSafeAreaPadding
        >
            <HeaderWithBackButton
                title={translate('workspace.certinia.prerequisites.title')}
                shouldShowBackButton
                onBackButtonPress={() => Navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.flexGrow1}>
                <Text style={[styles.textHeadlineH1, styles.p5]}>{translate('workspace.certinia.prerequisites.step1Title')}</Text>
                <Text style={[styles.ph5, styles.pb4]}>{translate('workspace.certinia.prerequisites.step1Description')}</Text>
                <Text style={[styles.textHeadlineH1, styles.ph5, styles.pb2]}>{translate('workspace.certinia.prerequisites.step2Title')}</Text>
                <Text style={[styles.ph5, styles.pb4]}>{translate('workspace.certinia.prerequisites.step2Description')}</Text>
                <Text style={[styles.textHeadlineH1, styles.ph5, styles.pb2]}>{translate('workspace.certinia.prerequisites.step3Title')}</Text>
                <Text style={[styles.ph5, styles.pb4]}>{translate('workspace.certinia.prerequisites.step3Description')}</Text>
            </ScrollView>
            <FixedFooter
                style={[styles.mtAuto]}
                addBottomSafeAreaPadding
            >
                <Button
                    success
                    text={translate('workspace.certinia.prerequisites.connectButton')}
                    onPress={() => {
                        connectPolicyToFinancialForce(policyID, isSandbox);
                        Navigation.dismissModal();
                    }}
                    pressOnEnter
                    large
                />
            </FixedFooter>
        </ScreenWrapper>
    );
}

export default CertiniaPrerequisitesPage;
