import type {OnyxUpdate} from 'react-native-onyx';
import * as API from '@libs/API';
import type {ConnectPolicyToFinancialForceParams} from '@libs/API/parameters';
import {READ_COMMANDS, WRITE_COMMANDS} from '@libs/API/types';
import * as ErrorUtils from '@libs/ErrorUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';

function prepareOnyxDataForFinancialForceUpdate(policyID: string, settingKey: string, settingPath: string[], newValue: unknown, oldValue: unknown) {
    const buildNestedObject = (pathParts: string[], value: unknown): Record<string, unknown> => {
        if (pathParts.length === 0) {
            return {};
        }
        if (pathParts.length === 1) {
            return {[pathParts[0]]: value};
        }
        return {[pathParts[0]]: buildNestedObject(pathParts.slice(1), value)};
    };

    const optimisticData: Array<OnyxUpdate<typeof ONYXKEYS.COLLECTION.POLICY>> = [
        {
            onyxMethod: 'merge',
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    financialForce: {
                        config: {
                            ...buildNestedObject(settingPath, newValue),
                            pendingFields: {
                                [settingKey]: CONST.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                [settingKey]: null,
                            },
                        },
                    },
                },
            },
        },
    ];

    const failureData: Array<OnyxUpdate<typeof ONYXKEYS.COLLECTION.POLICY>> = [
        {
            onyxMethod: 'merge',
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    financialForce: {
                        config: {
                            ...buildNestedObject(settingPath, oldValue ?? null),
                            pendingFields: {
                                [settingKey]: null,
                            },
                            errorFields: {
                                [settingKey]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                            },
                        },
                    },
                },
            },
        },
    ];

    const successData: Array<OnyxUpdate<typeof ONYXKEYS.COLLECTION.POLICY>> = [
        {
            onyxMethod: 'merge',
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    financialForce: {
                        config: {
                            pendingFields: {
                                [settingKey]: null,
                            },
                            errorFields: {
                                [settingKey]: null,
                            },
                        },
                    },
                },
            },
        },
    ];

    return {optimisticData, failureData, successData};
}

function connectPolicyToFinancialForce(policyID: string, isSandbox: boolean) {
    const parameters: ConnectPolicyToFinancialForceParams = {policyID, isSandbox};
    API.write(WRITE_COMMANDS.CONNECT_POLICY_TO_FINANCIAL_FORCE, parameters, {});
}

function syncPolicyToFinancialForce(policyID: string) {
    API.read(READ_COMMANDS.SYNC_POLICY_TO_FINANCIAL_FORCE, {policyID}, {});
}

function updateFinancialForceDimension1Mapping(policyID: string, value: string) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.DIMENSION1,
        ['coding', 'dimension1'],
        value,
        undefined,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_DIMENSION1_MAPPING, {policyID, value}, {optimisticData, failureData, successData});
}

function updateFinancialForceDimension2Mapping(policyID: string, value: string) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.DIMENSION2,
        ['coding', 'dimension2'],
        value,
        undefined,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_DIMENSION2_MAPPING, {policyID, value}, {optimisticData, failureData, successData});
}

function updateFinancialForceDimension3Mapping(policyID: string, value: string) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.DIMENSION3,
        ['coding', 'dimension3'],
        value,
        undefined,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_DIMENSION3_MAPPING, {policyID, value}, {optimisticData, failureData, successData});
}

function updateFinancialForceDimension4Mapping(policyID: string, value: string) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.DIMENSION4,
        ['coding', 'dimension4'],
        value,
        undefined,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_DIMENSION4_MAPPING, {policyID, value}, {optimisticData, failureData, successData});
}

function updateFinancialForceSyncTax(policyID: string, enabled: boolean) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.SYNC_TAX,
        ['coding', 'syncTax'],
        enabled,
        !enabled,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_SYNC_TAX, {policyID, enabled}, {optimisticData, failureData, successData});
}

function updateFinancialForceExporter(policyID: string, exporter: string) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.EXPORTER,
        ['export', 'exporter'],
        exporter,
        undefined,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_EXPORTER, {policyID, email: exporter}, {optimisticData, failureData, successData});
}

function updateFinancialForceExportStatus(policyID: string, status: string) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.EXPORT_STATUS,
        ['export', 'exportStatus'],
        status,
        undefined,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_EXPORT_STATUS, {policyID, value: status}, {optimisticData, failureData, successData});
}

function updateFinancialForceExportDate(policyID: string, date: string) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.EXPORT_DATE,
        ['export', 'exportDate'],
        date,
        undefined,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_EXPORT_DATE, {policyID, value: date}, {optimisticData, failureData, successData});
}

function updateFinancialForceDefaultVendor(policyID: string, vendorAccountID: string) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.VENDOR_ACCOUNT,
        ['export', 'vendorAccount'],
        vendorAccountID,
        undefined,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_DEFAULT_VENDOR, {policyID, vendorID: vendorAccountID}, {optimisticData, failureData, successData});
}

function updateFinancialForceAutoSync(policyID: string, enabled: boolean) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.AUTO_SYNC,
        ['autoSync', 'enabled'],
        enabled,
        !enabled,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_AUTO_SYNC, {policyID, enabled}, {optimisticData, failureData, successData});
}

function updateFinancialForceSyncReimbursedReports(policyID: string, enabled: boolean) {
    const {optimisticData, failureData, successData} = prepareOnyxDataForFinancialForceUpdate(
        policyID,
        CONST.CERTINIA_CONFIG.SYNC_REIMBURSED_REPORTS,
        ['advanced', 'syncReimbursedReports'],
        enabled,
        !enabled,
    );
    API.write(WRITE_COMMANDS.UPDATE_FINANCIAL_FORCE_SYNC_REIMBURSED_REPORTS, {policyID, enabled}, {optimisticData, failureData, successData});
}

export {
    connectPolicyToFinancialForce,
    syncPolicyToFinancialForce,
    updateFinancialForceDimension1Mapping,
    updateFinancialForceDimension2Mapping,
    updateFinancialForceDimension3Mapping,
    updateFinancialForceDimension4Mapping,
    updateFinancialForceSyncTax,
    updateFinancialForceExporter,
    updateFinancialForceExportStatus,
    updateFinancialForceExportDate,
    updateFinancialForceDefaultVendor,
    updateFinancialForceAutoSync,
    updateFinancialForceSyncReimbursedReports,
};
