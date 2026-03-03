import React from 'react';
import type { DataType, PhotoProviderBase } from './types';
import './PhotoSlider.less';
export interface IPhotoSliderProps extends PhotoProviderBase {
    images: DataType[];
    index?: number;
    onIndexChange?: (index: number) => void;
    visible: boolean;
    onClose: (evt?: React.MouseEvent | React.TouchEvent) => void;
    afterClose?: () => void;
}
export default function PhotoSlider(props: IPhotoSliderProps): JSX.Element | null;
