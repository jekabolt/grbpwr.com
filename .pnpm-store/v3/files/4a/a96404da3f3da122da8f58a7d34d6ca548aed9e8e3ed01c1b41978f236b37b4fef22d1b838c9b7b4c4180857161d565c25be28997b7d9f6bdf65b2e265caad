import React from 'react';
import type { DataType, PhotoProviderBase } from './types';
export interface PhotoProviderProps extends PhotoProviderBase {
    children: React.ReactNode;
    onIndexChange?: (index: number, state: PhotoProviderState) => void;
    onVisibleChange?: (visible: boolean, index: number, state: PhotoProviderState) => void;
}
declare type PhotoProviderState = {
    images: DataType[];
    visible: boolean;
    index: number;
};
export default function PhotoProvider({ children, onIndexChange, onVisibleChange, ...restProps }: PhotoProviderProps): JSX.Element;
export {};
