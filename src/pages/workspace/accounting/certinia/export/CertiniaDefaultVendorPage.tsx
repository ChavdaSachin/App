import React, {useCallback} from 'react';
import RadioListItem from '@components/SelectionList/ListItem/RadioListItem';
import SelectionScreen from '@components/SelectionScreen';
import type {SelectorType} from '@components/SelectionScreen';
import useLocalize from '@hooks/useLocalize';
import {updateFinancialForceDefaultVendor} from '@libs/actions/connections/FinancialForce';
import Navigation from '@libs/Navigation/Navigation';
import withPolicyConnections from '@pages/workspace/withPolicyConnections';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

function CertiniaDefaultVendorPage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const policyID = policy?.id ?? '';
    const config = policy?.connections?.financialForce?.config;
    const vendors = policy?.connections?.financialForce?.data?.vendors ?? [];
    const currentVendorID = config?.export?.vendorAccount;

    const vendorOptions: Array<SelectorType<string>> = vendors.map((vendor) => ({
        value: vendor.id,
        text: vendor.name,
        keyForList: vendor.id,
        isSelected: vendor.id === currentVendorID,
    }));

    const selectVendor = useCallback(
        (row: {value: string}) => {
            if (row.value !== currentVendorID) {
                updateFinancialForceDefaultVendor(policyID, row.value);
            }
            Navigation.goBack(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT.getRoute(policyID));
        },
        [policyID, currentVendorID],
    );

    return (
        <SelectionScreen
            policyID={policyID}
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            displayName="CertiniaDefaultVendorPage"
            data={vendorOptions}
            listItem={RadioListItem}
            onSelectRow={selectVendor}
            initiallyFocusedOptionKey={currentVendorID}
            headerTitleAlreadyTranslated={translate('workspace.certinia.export.defaultVendor')}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.CERTINIA}
            onBackButtonPress={() => Navigation.goBack(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT.getRoute(policyID))}
        />
    );
}

export default withPolicyConnections(CertiniaDefaultVendorPage);
