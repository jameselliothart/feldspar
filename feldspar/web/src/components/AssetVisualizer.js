import React from 'react';
import PriceChart from './PriceChart';
import AssetSelector from './AssetSelector';
import Commodities from '.././curve_config/commodities.json';
import WTIData from '../.mockdata/WTI-Monthly.json'
import openSocket from 'socket.io-client';

const SOCKET = openSocket(process.env.REACT_APP_SOCKET_ENDPOINT);  // fails silently if not picked up
// TODO deal with 5 queries / minute
// TODO probably limit to 4 curves at once
export default function AssetVisualizer({ availableAssets = Commodities.functions }) {
    const data = WTIData;
    data.forEach(d => d.data.sort((a, b) => (new Date(a.date)) - (new Date(b.date))));
    const [assetData, setAssetData] = React.useState([]);

    const updateAssetSelection = (selectedAssets) => {
        assetData.forEach(ad => SOCKET.off(`FromServer.Command.${ad.key}`));
        setAssetData([]);
        selectedAssets.forEach(asset => {
            const query = `${asset}|MONTHLY`;
            SOCKET.on(`FromServer.Command.${query}`, d => setAssetData([...assetData, d]));
            console.log('FromClient.Query', query, 'emitted');
            SOCKET.emit('FromClient.Query', query);
        });
    };

    return (
        <div>
            <AssetSelector assets={availableAssets} handleSelect={updateAssetSelection}></AssetSelector>
            <PriceChart assetDataSets={assetData}></PriceChart>
        </div>
    )
}