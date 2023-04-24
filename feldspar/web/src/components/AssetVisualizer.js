import React from 'react';
import PriceChart from './PriceChart';
import AssetSelector from './AssetSelector';
import Commodities from '.././curve_config/commodities.json';
import WTIData from '../.mockdata/WTI-Monthly.json'

export default function AssetVisualizer({ availableAssets = Commodities.functions }) {
    const data = WTIData;
    data.data.sort((a, b) => (new Date(a.date)) - (new Date(b.date)));

    const updateAssetSelection = (selectedAssets) => {
        console.log('FromClient.Query', selectedAssets.map(a => `${a}|MONTHLY`));
    };

    return (
        <div>
            <AssetSelector assets={availableAssets} handleSelect={updateAssetSelection}></AssetSelector>
            <PriceChart data={data}></PriceChart>
        </div>
    )
}