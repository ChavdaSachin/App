import {useEffect} from 'react';
import useHasPoliciesConnectedToCertinia from '@hooks/useHasPoliciesConnectedToCertinia';
import useOnyx from '@hooks/useOnyx';
import {isAuthenticationError} from '@libs/actions/connections';
import Navigation from '@libs/Navigation/Navigation';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';

type ConnectToCertiniaFlowProps = {
    policyID: string;
};

function ConnectToCertiniaFlow({policyID}: ConnectToCertiniaFlowProps) {
    const hasPoliciesConnectedToCertinia = useHasPoliciesConnectedToCertinia();
    const [policy] = useOnyx(`${ONYXKEYS.COLLECTION.POLICY}${policyID}`);
    const isAuthError = isAuthenticationError(policy, CONST.POLICY.CONNECTIONS.NAME.CERTINIA);

    useEffect(() => {
        if (isAuthError) {
            Navigation.navigate(ROUTES.POLICY_ACCOUNTING_CERTINIA_PREREQUISITES.getRoute(policyID));
            return;
        }
        if (!hasPoliciesConnectedToCertinia) {
            Navigation.navigate(ROUTES.POLICY_ACCOUNTING_CERTINIA_PREREQUISITES.getRoute(policyID));
            return;
        }
        Navigation.navigate(ROUTES.POLICY_ACCOUNTING_CERTINIA_EXISTING_CONNECTIONS.getRoute(policyID));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

export default ConnectToCertiniaFlow;
