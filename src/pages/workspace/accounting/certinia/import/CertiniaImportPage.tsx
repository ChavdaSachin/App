import React from 'react';
import ConnectionLayout from '@components/ConnectionLayout';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import OfflineWithFeedback from '@components/OfflineWithFeedback';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import {updateFinancialForceSyncTax} from '@libs/actions/connections/FinancialForce';
import {getLatestErrorField} from '@libs/ErrorUtils';
import Navigation from '@libs/Navigation/Navigation';
import {areSettingsInErrorFields, settingsPendingAction} from '@libs/PolicyUtils';
import withPolicy from '@pages/workspace/withPolicy';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import ToggleSettingOptionRow from '@pages/workspace/workflows/ToggleSettingsOptionRow';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';
import {getDisplayTypeLabel} from '../utils';

function CertiniaImportPage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const policyID = policy?.id;
    const config = policy?.connections?.financialForce?.config;

    const dimensions = [
        {key: CONST.CERTINIA_CONFIG.DIMENSION1, label: translate('workspace.certinia.import.dimension1'), dimension: 'dimension1' as const},
        {key: CONST.CERTINIA_CONFIG.DIMENSION2, label: translate('workspace.certinia.import.dimension2'), dimension: 'dimension2' as const},
        {key: CONST.CERTINIA_CONFIG.DIMENSION3, label: translate('workspace.certinia.import.dimension3'), dimension: 'dimension3' as const},
        {key: CONST.CERTINIA_CONFIG.DIMENSION4, label: translate('workspace.certinia.import.dimension4'), dimension: 'dimension4' as const},
    ];

    return (
        <ConnectionLayout
            displayName="CertiniaImportPage"
            headerTitle="workspace.accounting.import"
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            policyID={policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            contentContainerStyle={styles.pb2}
            titleStyle={styles.ph5}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.CERTINIA}
        >
            <OfflineWithFeedback pendingAction={settingsPendingAction(['chartOfAccounts'], config?.pendingFields)}>
                <ToggleSettingOptionRow
                    title={translate('workspace.certinia.import.chartOfAccounts')}
                    subtitle={translate('workspace.certinia.import.chartOfAccountsDescription')}
                    switchAccessibilityLabel={translate('workspace.certinia.import.chartOfAccounts')}
                    shouldPlaceSubtitleBelowSwitch
                    wrapperStyle={[styles.mv3, styles.mh5]}
                    isActive
                    disabled
                    onToggle={() => {}}
                />
            </OfflineWithFeedback>

            {dimensions.map(({key, label, dimension}) => (
                <OfflineWithFeedback
                    key={key}
                    pendingAction={settingsPendingAction([key], config?.pendingFields)}
                >
                    <MenuItemWithTopDescription
                        title={translate(getDisplayTypeLabel(config?.coding?.[dimension]))}
                        description={label}
                        shouldShowRightIcon
                        onPress={() => Navigation.navigate(ROUTES.POLICY_ACCOUNTING_CERTINIA_DIMENSION_MAPPING.getRoute(policyID, dimension))}
                        brickRoadIndicator={areSettingsInErrorFields([key], config?.errorFields) ? CONST.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}
                    />
                </OfflineWithFeedback>
            ))}

            <OfflineWithFeedback pendingAction={settingsPendingAction([CONST.CERTINIA_CONFIG.SYNC_TAX], config?.pendingFields)}>
                <ToggleSettingOptionRow
                    title={translate('common.tax')}
                    subtitle={translate('workspace.certinia.import.taxDescription')}
                    switchAccessibilityLabel={translate('common.tax')}
                    shouldPlaceSubtitleBelowSwitch
                    wrapperStyle={[styles.mv3, styles.mh5]}
                    isActive={!!config?.coding?.syncTax}
                    onToggle={(enabled) => updateFinancialForceSyncTax(policyID ?? '', enabled)}
                    pendingAction={settingsPendingAction([CONST.CERTINIA_CONFIG.SYNC_TAX], config?.pendingFields)}
                    errors={getLatestErrorField(config ?? {}, CONST.CERTINIA_CONFIG.SYNC_TAX)}
                    onCloseError={() => {}}
                />
            </OfflineWithFeedback>
        </ConnectionLayout>
    );
}

export default withPolicy(CertiniaImportPage);
