import React from 'react';
import {useRoute} from '@react-navigation/native';
import RadioListItem from '@components/SelectionList/ListItem/RadioListItem';
import SelectionScreen from '@components/SelectionScreen';
import type {SelectorType} from '@components/SelectionScreen';
import useLocalize from '@hooks/useLocalize';
import usePolicy from '@hooks/usePolicy';
import {
    updateFinancialForceDimension1Mapping,
    updateFinancialForceDimension2Mapping,
    updateFinancialForceDimension3Mapping,
    updateFinancialForceDimension4Mapping,
} from '@libs/actions/connections/FinancialForce';
import Navigation from '@libs/Navigation/Navigation';
import type {SettingsNavigatorParamList} from '@libs/Navigation/types';
import CONST from '@src/CONST';
import SCREENS from '@src/SCREENS';

type DimensionKey = 'dimension1' | 'dimension2' | 'dimension3' | 'dimension4';

function CertiniaDimensionMappingPage() {
    const {translate} = useLocalize();
    const route = useRoute();
    const routeParams = route.params as SettingsNavigatorParamList[typeof SCREENS.WORKSPACE.ACCOUNTING.CERTINIA_DIMENSION_MAPPING];
    const policyID = routeParams?.policyID ?? '';
    const dimension = (routeParams?.dimension ?? 'dimension1') as DimensionKey;
    const policy = usePolicy(policyID);
    const config = policy?.connections?.financialForce?.config;
    const currentValue = config?.coding?.[dimension];

    const updateDimensionMapping: Record<DimensionKey, (policyId: string, value: string) => void> = {
        dimension1: updateFinancialForceDimension1Mapping,
        dimension2: updateFinancialForceDimension2Mapping,
        dimension3: updateFinancialForceDimension3Mapping,
        dimension4: updateFinancialForceDimension4Mapping,
    };

    const dimensionNumber = dimension.replace('dimension', '');
    const sectionItems: Array<SelectorType<string>> = [
        {
            value: CONST.CERTINIA_MAPPING_VALUE.DEFAULT,
            text: translate('workspace.certinia.import.doNotMap'),
            keyForList: CONST.CERTINIA_MAPPING_VALUE.DEFAULT,
            isSelected: CONST.CERTINIA_MAPPING_VALUE.DEFAULT === currentValue,
        },
        {
            value: CONST.CERTINIA_MAPPING_VALUE.TAG,
            text: translate('workspace.accounting.importTypes.TAG'),
            keyForList: CONST.CERTINIA_MAPPING_VALUE.TAG,
            isSelected: CONST.CERTINIA_MAPPING_VALUE.TAG === currentValue,
        },
        {
            value: CONST.CERTINIA_MAPPING_VALUE.REPORT_FIELD,
            text: translate('workspace.accounting.importTypes.REPORT_FIELD'),
            keyForList: CONST.CERTINIA_MAPPING_VALUE.REPORT_FIELD,
            isSelected: CONST.CERTINIA_MAPPING_VALUE.REPORT_FIELD === currentValue,
        },
    ];

    return (
        <SelectionScreen
            policyID={policyID}
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
            displayName={`CertiniaDimensionMappingPage.${dimension}`}
            data={sectionItems}
            listItem={RadioListItem}
            onSelectRow={(selection) => {
                updateDimensionMapping[dimension](policyID, selection.value);
                Navigation.goBack();
            }}
            initiallyFocusedOptionKey={currentValue}
            headerTitleAlreadyTranslated={translate('workspace.certinia.import.dimensionMapping', {n: dimensionNumber})}
            connectionName={CONST.POLICY.CONNECTIONS.NAME.CERTINIA}
            onBackButtonPress={() => Navigation.goBack()}
        />
    );
}

export default CertiniaDimensionMappingPage;

