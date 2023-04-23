import React from 'react';
import PriceChart from './PriceChart';
import AssetSelector from './AssetSelector';

const STARTING_ASSETS = [
    { key: 'WTI', name: 'WTI' },
    { key: 'BRENT', name: 'Brent' },
    { key: 'NATURAL_GAS', name: 'Natural Gas' },
]

export default function AssetVisualizer({ data, startingAssets = STARTING_ASSETS }) {

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