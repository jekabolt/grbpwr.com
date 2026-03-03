import React from 'react';
import type { BrokenElementParams } from './types';
import './Photo.less';
export interface IPhotoLoadedParams {
    loaded?: boolean;
    naturalWidth?: number;
    naturalHeight?: number;
    broken?: boolean;
}
export interface IPhotoProps extends React.HTMLAttributes<HTMLElement> {
    src: string;
    loaded: boolean;
    broken: boolean;
    onPhotoLoad: (params: IPhotoLoadedParams) => void;
    loadingElement?: JSX.Element;
    brokenElement?: JSX.Element | ((photoProps: BrokenElementParams) => JSX.Element);
}
export default function Photo({ src, loaded, broken, className, onPhotoLoad, loadingElement, brokenElement, ...restProps }: IPhotoProps): JSX.Element | null;
