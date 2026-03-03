import React from 'react';
import type { PhotoRenderParams } from './types';
export interface PhotoViewProps {
    /**
     * 图片地址
     */
    src?: string;
    /**
     * 自定义渲染，优先级比 src 低
     */
    render?: (props: PhotoRenderParams) => React.ReactNode;
    /**
     * 自定义覆盖节点
     */
    overlay?: React.ReactNode;
    /**
     * 自定义渲染节点宽度
     */
    width?: number;
    /**
     * 自定义渲染节点高度
     */
    height?: number;
    /**
     * 子节点，一般为缩略图
     */
    children?: React.ReactElement;
    /**
     * 触发的事件
     */
    triggers?: ('onClick' | 'onDoubleClick')[];
}
declare const PhotoView: React.FC<PhotoViewProps>;
export default PhotoView;
