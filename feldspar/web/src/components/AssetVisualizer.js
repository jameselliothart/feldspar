import React from 'react';
import PriceChart from './PriceChart';
import AssetSelector from './AssetSelector';
import Commodities from '.././curve_config/commodities.json';
import WTIData from '../.mockdata/WTI-Monthly.json'

export default function AssetVisualizer({ data = WTIData, startingAssets = Commodities.functions }) {
    data.data.sort((a, b) => (new Date(a.date)) - (new Date(b.date)));

    const [assets, setAssets] = React.useState([]);

    const updateAssetSelection = (selectedAssets) => {
        setAssets(selectedAssets);
    };

    return (
        <div>
            <AssetSelector assets={startingAssets} handleSelect={updateAssetSelection}></AssetSelector>
            {assets}
            <PriceChart data={data}></PriceChart>
        </div>
    )
}