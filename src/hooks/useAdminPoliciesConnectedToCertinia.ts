import ONYXKEYS from '@src/ONYXKEYS';
import {adminPoliciesConnectedToCertiniaSelector} from '@src/selectors/Policy';
import useOnyx from './useOnyx';

function useAdminPoliciesConnectedToCertinia() {
    const [policies] = useOnyx(ONYXKEYS.COLLECTION.POLICY);
    return adminPoliciesConnectedToCertiniaSelector(policies);
}

export default useAdminPoliciesConnectedToCertinia;
