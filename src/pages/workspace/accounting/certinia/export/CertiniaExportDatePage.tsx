import React, {useCallback} from 'react';
import RadioListItem from '@components/SelectionList/ListItem/RadioListItem';
import SelectionScreen from '@components/SelectionScreen';
import type {SelectorType} from '@components/SelectionScreen';
import useLocalize from '@hooks/useLocalize';
import {updateFinancialForceExportDate} from '@libs/actions/connections/FinancialForce';
import Navigation from '@libs/Navigation/Navigation';
import withPolicyConnections from '@pages/workspace/withPolicyConnections';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

function CertiniaExportDatePage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const policyID = policy?.id ?? '';
    const config = policy?.connections?.financialForce?.config;
    const currentDate = config?.export?.exportDate;

    const dateOptions: Array<SelectorType<string>> = [
        {
            value: CONST.CERTINIA_EXPORT_DATE.LAST_EXPENSE,
            text: translate('workspace.certinia.export.dateOptions.LAST_EXPENSE'),
            keyForList: CONST.CERTINIA_EXPORT_DATE.LAST_EXPENSE,
            isSelected: currentDate === CONST.CERTINIA_EXPORT_DATE.LAST_EXPENSE,
        },
        {
            value: CONST.CERTINIA_EXPORT_DATE.REPORT_SUBMITTED,
            text: translate('workspace.certinia.export.dateOptions.REPORT_SUBMITTED'),
            keyForList: CONST.CERTINIA_EXPORT_DATE.REPORT_SUBMITTED,
            isSelected: currentDate === CONST.CERTINIA_EXPORT_DATE.REPORT_SUBMITTED,
        },
        {
            value: CONST.CERTINIA_EXPORT_DATE.REPORT_EXPORTED,
            text: translate('workspace.certinia.export.dateOptions.REPORT_EXPORTED'),
            keyForList: CONST.CERTINIA_EXPORT_DATE.REPORT_EXPORTED,
            isSelected: currentDate === CONST.CERTINIA_EXPORT_DATE.REPORT_EXPORTED,
        },
    ];

    const selectDate = useCallback(
        (row: {value: string}) => {
            if (row.value !== currentDate) {
                updateFinancialForceExportDate(policyID, row.value);
            }
            Navigation.goBack(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT.getRoute(policyID));
        },
        [policyID, currentDate],
    );

    return (
        <SelectionScreen
            policyID={policyID}
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            displayName="CertiniaExportDatePage"
            data={dateOptions}
            listItem={RadioListItem}
            onSelectRow={selectDate}
            initiallyFocusedOptionKey={currentDate}
            headerTitleAlreadyTranslated={translate('workspace.certinia.export.payableInvoiceDate')}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.CERTINIA}
            onBackButtonPress={() => Navigation.goBack(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT.getRoute(policyID))}
        />
    );
}

export default withPolicyConnections(CertiniaExportDatePage);
