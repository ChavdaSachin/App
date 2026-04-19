import isEmpty from 'lodash/isEmpty';
import React, {useCallback, useMemo} from 'react';
import RadioListItem from '@components/SelectionList/ListItem/RadioListItem';
import type {ListItem} from '@components/SelectionList/types';
import SelectionScreen from '@components/SelectionScreen';
import useCurrentUserPersonalDetails from '@hooks/useCurrentUserPersonalDetails';
import useLocalize from '@hooks/useLocalize';
import {updateFinancialForceExporter} from '@libs/actions/connections/FinancialForce';
import {getAdminEmployees, isExpensifyTeam} from '@libs/PolicyUtils';
import Navigation from '@libs/Navigation/Navigation';
import withPolicyConnections from '@pages/workspace/withPolicyConnections';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

type CardListItem = ListItem & {
    value: string;
};

function CertiniaPreferredExporterPage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const policyOwner = policy?.owner ?? '';
    const config = policy?.connections?.financialForce?.config;
    const exporters = getAdminEmployees(policy);
    const {login: currentUserLogin} = useCurrentUserPersonalDetails();
    const policyID = policy?.id ?? '';

    const data: CardListItem[] = useMemo(() => {
        if (!isEmpty(policyOwner) && isEmpty(exporters)) {
            return [
                {
                    value: policyOwner,
                    text: policyOwner,
                    keyForList: policyOwner,
                    isSelected: config?.export?.exporter === policyOwner,
                },
            ];
        }

        return exporters?.reduce<CardListItem[]>((options, exporter) => {
            if (!exporter.email) {
                return options;
            }

            if (isExpensifyTeam(exporter.email) && !isExpensifyTeam(policyOwner) && !isExpensifyTeam(currentUserLogin)) {
                return options;
            }

            options.push({
                value: exporter.email,
                text: exporter.email,
                keyForList: exporter.email,
                isSelected: config?.export?.exporter === exporter.email,
            });
            return options;
        }, []);
    }, [config?.export?.exporter, exporters, policyOwner, currentUserLogin]);

    const selectExporter = useCallback(
        (row: CardListItem) => {
            if (row.value !== config?.export?.exporter) {
                updateFinancialForceExporter(policyID, row.value);
            }
            Navigation.goBack(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT.getRoute(policyID));
        },
        [policyID, config?.export?.exporter],
    );

    return (
        <SelectionScreen
            policyID={policyID}
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            displayName="CertiniaPreferredExporterPage"
            data={data}
            listItem={RadioListItem}
            onSelectRow={selectExporter}
            initiallyFocusedOptionKey={config?.export?.exporter}
            headerTitleAlreadyTranslated={translate('workspace.accounting.preferredExporter')}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.CERTINIA}
            onBackButtonPress={() => Navigation.goBack(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXPORT.getRoute(policyID))}
        />
    );
}

export default withPolicyConnections(CertiniaPreferredExporterPage);
