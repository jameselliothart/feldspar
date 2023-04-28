import React from 'react';
import PriceChart from './PriceChart';
import AssetSelector from './AssetSelector';
import Commodities from '.././curve_config/commodities.json';
import openSocket from 'socket.io-client';

// fails silently if not picked up
// TODO this seems to create a lot of new connections - need to clean this up
// TODO deal with 5 queries / minute
// TODO probably limit to 4 curves at once
export default function AssetVisualizer({ availableAssets = Commodities.functions }) {
    const [socket, setSocket] = React.useState(null);
    const [assetData, setAssetData] = React.useState([]);

    React.useEffect(() => {
        const ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT;
        console.log('Opening socket to', ENDPOINT)
        const newSocket = openSocket(ENDPOINT);
        console.log(`Visualizer socket connected: [${newSocket.id}]`);
        setSocket(newSocket);


        return () => {
            console.log('Disconnecting', newSocket.id);
            newSocket.disconnect();
        }
    }, [])

    const updateAssetSelection = (selectedAssets) => {
        assetData.forEach(ad => socket.off(`FromServer.Command.${ad.key}`));
        setAssetData([]);
        selectedAssets.forEach(asset => {
            const query = `${asset}|MONTHLY`;
            socket.on(`FromServer.Command.${query}`, d => setAssetData([...assetData, d]));
            console.log('FromClient.Query', query, 'emitted');
            socket.emit('FromClient.Query', query);
        });
    };

    return (
        <div>
            <AssetSelector assets={availableAssets} handleSelect={updateAssetSelection}></AssetSelector>
            {assetData.length > 0 ? <PriceChart assetDataSets={assetData}></PriceChart> : 'Select some assets to get started'}
        </div>
    )
}