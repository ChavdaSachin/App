import type {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import TextInput from '@components/TextInput';
import useAutoFocusInput from '@hooks/useAutoFocusInput';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import * as Policy from '@libs/actions/Policy/Policy';
import * as PolicyUtils from '@libs/PolicyUtils';
import * as ValidationUtils from '@libs/ValidationUtils';
import Navigation from '@navigation/Navigation';
import type {SettingsNavigatorParamList} from '@navigation/types';
import AccessOrNotFoundWrapper from '@pages/workspace/AccessOrNotFoundWrapper';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type SCREENS from '@src/SCREENS';
import INPUT_IDS from '@src/types/form/EditExpensifyCardNameForm';
import type {CardFeeds} from '@src/types/onyx';

type WorkspaceCompanyCardEditCardNamePageProps = StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.COMPANY_CARD_NAME>;

const mockedFeeds: CardFeeds = {
    companyCards: {
        cdfbmo: {
            pending: false,
            asrEnabled: true,
            forceReimbursable: 'force_no',
            liabilityType: 'corporate',
            preferredPolicy: '',
            reportTitleFormat: '{report:card}{report:bank}{report:submit:from}{report:total}{report:enddate:MMMM}',
            statementPeriodEndDay: 'LAST_DAY_OF_MONTH',
        },
    },
    companyCardNicknames: {
        cdfbmo: 'BMO MasterCard',
    },
};

function WorkspaceCompanyCardEditCardNamePage({route}: WorkspaceCompanyCardEditCardNamePageProps) {
    const {policyID, cardID} = route.params;
    const workspaceAccountID = PolicyUtils.getWorkspaceAccountID(policyID);

    const {translate} = useLocalize();
    const {inputCallbackRef} = useAutoFocusInput();
    const styles = useThemeStyles();

    const [lastSelectedFeed] = useOnyx(`${ONYXKEYS.COLLECTION.LAST_SELECTED_FEED}${policyID}`);
    const defaultFeed = Object.keys(mockedFeeds?.companyCards ?? {})[0];
    const selectedFeed = lastSelectedFeed ?? defaultFeed;

    // TODO: use data form onyx instead of mocked one when API is implemented
    const [cardsList] = useOnyx(`${ONYXKEYS.COLLECTION.WORKSPACE_CARDS_LIST}${workspaceAccountID}_${selectedFeed}`);
    const card = cardsList?.[cardID];

    const submit = (values: FormOnyxValues<typeof ONYXKEYS.FORMS.EDIT_WORKSPACE_COMPANY_CARD_NAME_FORM>) => {
        Policy.updateCompanyCardName(workspaceAccountID, Number(cardID), values[INPUT_IDS.NAME], selectedFeed);
        Navigation.goBack();
    };

    const validate = (values: FormOnyxValues<typeof ONYXKEYS.FORMS.EDIT_WORKSPACE_COMPANY_CARD_NAME_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.EDIT_EXPENSIFY_CARD_NAME_FORM> =>
        ValidationUtils.getFieldRequiredErrors(values, [INPUT_IDS.NAME]);

    return (
        <AccessOrNotFoundWrapper
            policyID={policyID}
            featureName={CONST.POLICY.MORE_FEATURES.ARE_COMPANY_CARDS_ENABLED}
        >
            <ScreenWrapper
                testID={WorkspaceCompanyCardEditCardNamePage.displayName}
                shouldEnablePickerAvoiding={false}
                shouldEnableMaxHeight
            >
                <HeaderWithBackButton
                    title={translate('workspace.moreFeatures.companyCards.cardName')}
                    onBackButtonPress={() => Navigation.goBack(ROUTES.WORKSPACE_COMPANY_CARD_DETAILS.getRoute(policyID, cardID))}
                />
                <FormProvider
                    formID={ONYXKEYS.FORMS.EDIT_WORKSPACE_COMPANY_CARD_NAME_FORM}
                    submitButtonText={translate('common.save')}
                    onSubmit={submit}
                    style={[styles.flex1, styles.mh5]}
                    enabledWhenOffline
                    validate={validate}
                >
                    <InputWrapper
                        InputComponent={TextInput}
                        inputID={INPUT_IDS.NAME}
                        label={translate('workspace.moreFeatures.companyCards.cardName')}
                        hint={translate('workspace.moreFeatures.companyCards.giveItNameInstruction')}
                        aria-label={translate('workspace.moreFeatures.companyCards.cardName')}
                        role={CONST.ROLE.PRESENTATION}
                        defaultValue={card?.nameValuePairs?.cardTitle}
                        maxLength={CONST.EXPENSIFY_CARD.CARD_TITLE_INPUT_LIMIT}
                        ref={inputCallbackRef}
                    />
                </FormProvider>
            </ScreenWrapper>
        </AccessOrNotFoundWrapper>
    );
}

WorkspaceCompanyCardEditCardNamePage.displayName = 'WorkspaceCompanyCardEditCardNamePage';

export default WorkspaceCompanyCardEditCardNamePage;
