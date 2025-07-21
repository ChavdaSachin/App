import React from 'react';
import type {CustomRendererProps, TNode} from 'react-native-render-html';
import Text from '@components/Text'; // your custom component

function DelRenderer<T extends TNode>({
    tnode,
    InternalRenderer,
    TDefaultRenderer,
    TNodeChildrenRenderer,
    sharedProps,
    style,
    ...defaultRendererProps
}: CustomRendererProps<T>) {
    return (
        <Text selectable={true}>
            {tnode.children.map((childTNode, index) => {
                const isEmoji = childTNode.tagName === 'emoji';

                const childStyle = [
                    ...(Array.isArray(style) ? style : [style]),
                    {textDecorationLine: isEmoji ? 'none' : 'line-through'},
                    // isEmoji && {fontSize: 18}, // ensure emoji sizing if needed
                ];

                return (
                    <InternalRenderer
                        key={index}
                        tnode={childTNode as T}
                        TDefaultRenderer={TDefaultRenderer}
                        TNodeChildrenRenderer={TNodeChildrenRenderer}
                        sharedProps={sharedProps}
                        style={childStyle}
                        {...defaultRendererProps}
                    />
                );
            })}
        </Text>
    );
}

export default DelRenderer;
