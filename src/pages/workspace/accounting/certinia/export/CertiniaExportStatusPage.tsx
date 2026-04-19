import React, {useCallback} from 'react';
import RadioListItem from '@components/SelectionList/ListItem/RadioListItem';
import SelectionScreen from '@components/SelectionScreen';
import type {SelectorType} from '@components/SelectionScreen';
import useLocalize from '@hooks/useLocalize';
import {updateFinancialForceExportStatus} from '@libs/actions/connections/FinancialForce';
import Navigation from '@libs/Navigation/Navigation';
import withPolicyConnections from '@pages/workspace/withPolicyConnections';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

function CertiniaExportStatusPage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const policyID = policy?.id ?? '';
    const config = policy?.connections?.financialForce?.config;
    const currentStatus = config?.export?.exportStatus;

    const statusOptions: Array<SelectorType<string>> = [
        {
            value: CONST.CERTINIA_EXPORT_STATUS.APPROVED,
            text: translate('workspace.certinia.export.statusOptions.APPROVED'),
            keyForList: CONST.CERTINIA_EXPORT_STATUS.APPROVED,
            isSelected: currentStatus === CONST.CERTINIA_EXPORT_STATUS.APPROVED,
        },
        {
            value: CONST.CERTINIA_EXPORT_STATUS.IN_PROGRESS,
            text: translate('workspace.certinia.export.statusOptions.IN_PROGRESS'),
            keyForList: CONST.CERTINIA_EXPORT_STATUS.IN_PROGRESS,
            isSelected: currentStatus === CONST.CERTINIA_EXPORT_STATUS.IN_PROGRESS,
        },
    ];

    const selectStatus = useCallback(
        (row: {value: string}) => {
            if (row.value !== currentStatus) {
                updateFinancialForceExportStatus(policyID, row.value);
            }
            Navigation.goBack(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT.getRoute(policyID));
        },
        [policyID, currentStatus],
    );

    return (
        <SelectionScreen
            policyID={policyID}
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            displayName="CertiniaExportStatusPage"
            data={statusOptions}
            listItem={RadioListItem}
            onSelectRow={selectStatus}
            initiallyFocusedOptionKey={currentStatus}
            headerTitleAlreadyTranslated={translate('workspace.certinia.export.payableInvoiceStatus')}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.CERTINIA}
            onBackButtonPress={() => Navigation.goBack(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT.getRoute(policyID))}
        />
    );
}

export default withPolicyConnections(CertiniaExportStatusPage);
