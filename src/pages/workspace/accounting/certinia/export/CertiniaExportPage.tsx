import React from 'react';
import ConnectionLayout from '@components/ConnectionLayout';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import OfflineWithFeedback from '@components/OfflineWithFeedback';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import Navigation from '@libs/Navigation/Navigation';
import {areSettingsInErrorFields, settingsPendingAction} from '@libs/PolicyUtils';
import withPolicyConnections from '@pages/workspace/withPolicyConnections';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

function CertiniaExportPage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const policyID = policy?.id;
    const config = policy?.connections?.financialForce?.config;
    const vendors = policy?.connections?.financialForce?.data?.vendors ?? [];

    const defaultVendorName = vendors.find((v) => v.id === config?.export?.vendorAccount)?.name ?? config?.export?.vendorAccount;

    const sections = [
        {
            description: translate('workspace.certinia.export.preferredExporter'),
            action: () => Navigation.navigate(ROUTES.POLICY_ACCOUNTING_CERTINIA_PREFERRED_EXPORTER.getRoute(policyID)),
            title: config?.export?.exporter,
            subscribedSettings: [CONST.CERTINIA_CONFIG.EXPORTER],
        },
        {
            description: translate('workspace.certinia.export.payableInvoiceStatus'),
            action: () => Navigation.navigate(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT_STATUS.getRoute(policyID)),
            title: config?.export?.exportStatus ? translate(`workspace.certinia.export.statusOptions.${config.export.exportStatus}`) : undefined,
            subscribedSettings: [CONST.CERTINIA_CONFIG.EXPORT_STATUS],
        },
        {
            description: translate('workspace.certinia.export.payableInvoiceDate'),
            action: () => Navigation.navigate(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT_DATE.getRoute(policyID)),
            title: config?.export?.exportDate ? translate(`workspace.certinia.export.dateOptions.${config.export.exportDate}`) : undefined,
            subscribedSettings: [CONST.CERTINIA_CONFIG.EXPORT_DATE],
        },
        {
            description: translate('workspace.certinia.export.reimbursableAsPayableInvoice'),
            title: translate('workspace.certinia.export.payableInvoice'),
            subscribedSettings: [],
            interactive: false,
        },
        {
            description: translate('workspace.certinia.export.nonReimbursableAsPayableInvoice'),
            title: translate('workspace.certinia.export.payableInvoice'),
            subscribedSettings: [],
            interactive: false,
        },
        {
            description: translate('workspace.certinia.export.defaultVendor'),
            action: () => Navigation.navigate(ROUTES.POLICY_ACCOUNTING_CERTINIA_DEFAULT_VENDOR.getRoute(policyID)),
            title: defaultVendorName,
            subscribedSettings: [CONST.CERTINIA_CONFIG.VENDOR_ACCOUNT],
        },
    ];

    return (
        <ConnectionLayout
            displayName="CertiniaExportPage"
            headerTitle="workspace.accounting.export"
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            policyID={policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            contentContainerStyle={styles.pb2}
            titleStyle={styles.ph5}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.CERTINIA}
        >
            {sections.map((section) => (
                <OfflineWithFeedback
                    key={section.description}
                    pendingAction={settingsPendingAction(section.subscribedSettings, config?.pendingFields)}
                >
                    <MenuItemWithTopDescription
                        title={section.title}
                        description={section.description}
                        shouldShowRightIcon={section.interactive !== false && !!section.action}
                        onPress={section.action}
                        interactive={section.interactive}
                        brickRoadIndicator={
                            section.subscribedSettings.length > 0 && areSettingsInErrorFields(section.subscribedSettings, config?.errorFields)
                                ? CONST.BRICK_ROAD_INDICATOR_STATUS.ERROR
                                : undefined
                        }
                    />
                </OfflineWithFeedback>
            ))}
        </ConnectionLayout>
    );
}

export default withPolicyConnections(CertiniaExportPage);
