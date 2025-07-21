// eslint-disable-next-line no-restricted-imports
import display from '@styles/utils/display';
import FontUtils from '@styles/utils/FontUtils';
import type EmojiDefaultStyles from './types';

const emojiDefaultStyles: EmojiDefaultStyles = {
    ...FontUtils.fontFamily.platform.EXP_NEUE,
    ...display.dInlineFlex,
    textDecorationLine: 'none',
};

export default emojiDefaultStyles;
