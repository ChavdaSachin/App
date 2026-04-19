import React from 'react';
import ConnectionLayout from '@components/ConnectionLayout';
import OfflineWithFeedback from '@components/OfflineWithFeedback';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import {updateFinancialForceAutoSync, updateFinancialForceSyncReimbursedReports} from '@libs/actions/connections/FinancialForce';
import {getLatestErrorField} from '@libs/ErrorUtils';
import Navigation from '@libs/Navigation/Navigation';
import {settingsPendingAction} from '@libs/PolicyUtils';
import withPolicy from '@pages/workspace/withPolicy';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import ToggleSettingOptionRow from '@pages/workspace/workflows/ToggleSettingsOptionRow';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

function CertiniaAdvancedPage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const policyID = policy?.id;
    const config = policy?.connections?.financialForce?.config;

    return (
        <ConnectionLayout
            displayName="CertiniaAdvancedPage"
            headerTitle="workspace.accounting.advanced"
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            policyID={policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            contentContainerStyle={styles.pb2}
            titleStyle={styles.ph5}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.CERTINIA}
            onBackButtonPress={() => Navigation.goBack(ROUTES.POLICY_ACCOUNTING.getRoute(policyID))}
        >
            <OfflineWithFeedback pendingAction={settingsPendingAction([CONST.CERTINIA_CONFIG.AUTO_SYNC], config?.pendingFields)}>
                <ToggleSettingOptionRow
                    title={translate('workspace.accounting.autoSync')}
                    subtitle={translate('workspace.certinia.advanced.autoSyncDescription')}
                    switchAccessibilityLabel={translate('workspace.accounting.autoSync')}
                    shouldPlaceSubtitleBelowSwitch
                    wrapperStyle={[styles.ph5, styles.pv3]}
                    isActive={!!config?.autoSync?.enabled}
                    onToggle={(enabled) => updateFinancialForceAutoSync(policyID ?? '', enabled)}
                    pendingAction={settingsPendingAction([CONST.CERTINIA_CONFIG.AUTO_SYNC], config?.pendingFields)}
                    errors={getLatestErrorField(config ?? {}, CONST.CERTINIA_CONFIG.AUTO_SYNC)}
                    onCloseError={() => {}}
                />
            </OfflineWithFeedback>

            <OfflineWithFeedback pendingAction={settingsPendingAction([CONST.CERTINIA_CONFIG.SYNC_REIMBURSED_REPORTS], config?.pendingFields)}>
                <ToggleSettingOptionRow
                    title={translate('workspace.accounting.reimbursedReports')}
                    subtitle={translate('workspace.certinia.advanced.syncReimbursedReportsDescription')}
                    switchAccessibilityLabel={translate('workspace.accounting.reimbursedReports')}
                    shouldPlaceSubtitleBelowSwitch
                    wrapperStyle={[styles.ph5, styles.pv3]}
                    isActive={!!config?.advanced?.syncReimbursedReports}
                    onToggle={(enabled) => updateFinancialForceSyncReimbursedReports(policyID ?? '', enabled)}
                    pendingAction={settingsPendingAction([CONST.CERTINIA_CONFIG.SYNC_REIMBURSED_REPORTS], config?.pendingFields)}
                    errors={getLatestErrorField(config ?? {}, CONST.CERTINIA_CONFIG.SYNC_REIMBURSED_REPORTS)}
                    onCloseError={() => {}}
                />
            </OfflineWithFeedback>
        </ConnectionLayout>
    );
}

export default withPolicy(CertiniaAdvancedPage);
