import type {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useOnyx} from 'react-native-onyx';
import * as CardUtils from '@libs/CardUtils';
import Navigation from '@libs/Navigation/Navigation';
import * as PolicyUtils from '@libs/PolicyUtils';
import type {SettingsNavigatorParamList} from '@navigation/types';
import AccessOrNotFoundWrapper from '@pages/workspace/AccessOrNotFoundWrapper';
import type {WithPolicyAndFullscreenLoadingProps} from '@pages/workspace/withPolicyAndFullscreenLoading';
import withPolicyAndFullscreenLoading from '@pages/workspace/withPolicyAndFullscreenLoading';
import * as Card from '@userActions/Card';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';
import {isEmptyObject} from '@src/types/utils/EmptyObject';
import AssigneeStep from './AssigneeStep';
import CardNameStep from './CardNameStep';
import CardTypeStep from './CardTypeStep';
import ConfirmationStep from './ConfirmationStep';
import LimitStep from './LimitStep';
import LimitTypeStep from './LimitTypeStep';
import * as Policy from '@userActions/Policy/Policy';
import { translate } from '@libs/Localize';
import ConfirmModal from '@components/ConfirmModal';
import useLocalize from '@hooks/useLocalize';
import { useIsFocused } from '@react-navigation/native';


type IssueNewCardPageProps = WithPolicyAndFullscreenLoadingProps & StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.EXPENSIFY_CARD_ISSUE_NEW>;

function IssueNewCardPage({policy, route}: IssueNewCardPageProps) {
    const [issueNewCard] = useOnyx(ONYXKEYS.ISSUE_NEW_EXPENSIFY_CARD);
    const [bankAccountList] = useOnyx(ONYXKEYS.BANK_ACCOUNT_LIST);
    const eligibleBankAccounts = CardUtils.getEligibleBankAccountsForCard(bankAccountList ?? {});
    const [reimbursementAccount] = useOnyx(ONYXKEYS.REIMBURSEMENT_ACCOUNT);
    const reimbursementAccountStatus = reimbursementAccount?.achData?.state ?? '';
    const isSetupUnfinished = isEmptyObject(bankAccountList) && reimbursementAccountStatus && reimbursementAccountStatus !== CONST.BANK_ACCOUNT.STATE.OPEN;
    const workspaceAccountID = PolicyUtils.getWorkspaceAccountID(policy?.id ?? '-1');
    const [cardSettings] = useOnyx(`${ONYXKEYS.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${workspaceAccountID}`);
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
    const paymentBankAccountID = cardSettings?.paymentBankAccountID ?? 0;

    const {currentStep} = issueNewCard ?? {};

    const policyID = policy?.id ?? '-1';
    const backTo = route?.params?.backTo;
    const {translate} = useLocalize();

    const confirmCurrencyChangeAndHideModal = useCallback(() => {
        if (!policy) {
            return;
        }
        Policy.updateGeneralSettings(policy.id, policy.name, CONST.CURRENCY.USD);
        setIsCurrencyModalOpen(false);
    }, [policy,]);

    useEffect(() => {
            if (!Policy.isCurrencySupportedForDirectReimbursement(policy?.outputCurrency ?? '')) {
                setIsCurrencyModalOpen(true);
            } else if(!eligibleBankAccounts.length || isSetupUnfinished) {
                Navigation.closeAndNavigate(ROUTES.BANK_ACCOUNT_WITH_STEP_TO_OPEN.getRoute('new', policy?.id, ROUTES.WORKSPACE_EXPENSIFY_CARD.getRoute(policy?.id ?? '-1')));
            } else if (!paymentBankAccountID) {
                Navigation.closeAndNavigate(ROUTES.WORKSPACE_EXPENSIFY_CARD_BANK_ACCOUNT.getRoute(policy?.id ?? '-1'));
            } else Card.startIssueNewCardFlow(policyID);
    }, [paymentBankAccountID, eligibleBankAccounts, isSetupUnfinished, policyID,isCurrencyModalOpen]);

    const getCurrentStep = () => {
        switch (currentStep) {
            case CONST.EXPENSIFY_CARD.STEP.ASSIGNEE:
                return <AssigneeStep policy={policy} />;
            case CONST.EXPENSIFY_CARD.STEP.CARD_TYPE:
                return <CardTypeStep />;
            case CONST.EXPENSIFY_CARD.STEP.LIMIT_TYPE:
                return <LimitTypeStep policy={policy} />;
            case CONST.EXPENSIFY_CARD.STEP.LIMIT:
                return <LimitStep />;
            case CONST.EXPENSIFY_CARD.STEP.CARD_NAME:
                return <CardNameStep />;
            case CONST.EXPENSIFY_CARD.STEP.CONFIRMATION:
                return (
                    <ConfirmationStep
                        policyID={policyID}
                        backTo={backTo}
                    />
                );
            default:
                return <AssigneeStep policy={policy} />;
        }
    };

    return (
        <AccessOrNotFoundWrapper
            accessVariants={[CONST.POLICY.ACCESS_VARIANTS.ADMIN, CONST.POLICY.ACCESS_VARIANTS.PAID]}
            policyID={policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}
        >
            {getCurrentStep()}
            <ConfirmModal
                    title={translate('workspace.common.expensifyCard')}
                    isVisible={isCurrencyModalOpen}
                    onConfirm={confirmCurrencyChangeAndHideModal}
                    onCancel={() => {setIsCurrencyModalOpen(false); Navigation.goBack();}}
                    prompt={translate('workspace.bankAccount.updateCurrencyPrompt')}
                    confirmText={translate('workspace.bankAccount.updateToUSD')}
                    cancelText={translate('common.cancel')}
                    danger
                />
        </AccessOrNotFoundWrapper>
    );
}

IssueNewCardPage.displayName = 'IssueNewCardPage';
export default withPolicyAndFullscreenLoading(IssueNewCardPage);
