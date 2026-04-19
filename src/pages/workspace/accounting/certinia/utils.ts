import type {TranslationPaths} from '@src/languages/types';
import CONST from '@src/CONST';

function getDisplayTypeLabel(displayType?: string): TranslationPaths {
    switch (displayType) {
        case CONST.CERTINIA_MAPPING_VALUE.TAG:
            return 'workspace.accounting.importTypes.TAG';
        case CONST.CERTINIA_MAPPING_VALUE.REPORT_FIELD:
            return 'workspace.accounting.importTypes.REPORT_FIELD';
        default:
            return 'workspace.accounting.notImported';
    }
}

export {getDisplayTypeLabel};
