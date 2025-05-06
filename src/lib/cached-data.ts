import { cache } from 'react';
import { serviceClient } from './api';

// Cache the product data fetch using React's cache function
export const getProduct = cache(async (gender: string, brand: string, name: string, id: number) => {
    console.log(`[Cache] Fetching product data for: ${gender}/${brand}/${name}/${id}`);

    const { product } = await serviceClient.GetProduct({
        gender,
        brand,
        name,
        id,
    });

    return product;
});

// Cache the products list data
export const getProductsPaged = cache(async (
    limit: number,
    offset: number,
    sortFactors?: any,
    orderFactor?: any,
    filterConditions?: any
) => {
    console.log(`[Cache] Fetching products paged data: limit=${limit}, offset=${offset}`);

    const response = await serviceClient.GetProductsPaged({
        limit,
        offset,
        sortFactors,
        orderFactor,
        filterConditions,
    });

    return response;
});

// You can add more cached functions as needed for other data requirements 