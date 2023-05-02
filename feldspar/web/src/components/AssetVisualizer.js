import React from 'react';
import Button from '@mui/material/Button';
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
    const [assetData, setAssetData] = React.useState({});
    const [trackedAssets, setTrackedAssets] = React.useState([]);

    React.useEffect(() => {
        const ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT;
        console.log('Opening socket to', ENDPOINT)
        const newSocket = openSocket(ENDPOINT);
        console.log(`Visualizer socket connected: [${newSocket.id}]`);
        setSocket(newSocket);
        newSocket.on('FromServer.Command.UpdateAssetData', (msg) => {
            console.log('Received FromServer.Command.UpdateAssetData for', msg.requestKey)
            const [assetKey] = msg.requestKey.split('|');
            const newAssetData = {...assetData, [assetKey]: msg.assetData};
            setAssetData(newAssetData);
        })


        return () => {
            console.log('Disconnecting', newSocket.id);
            newSocket.disconnect();
        }
    }, [assetData])

    const updateAssetSelection = (selectedAssets) => {
        setTrackedAssets(selectedAssets);
        selectedAssets.forEach(asset => {
            const query = `${asset}|MONTHLY`;
            console.log('FromClient.Query', query, 'emitted');
            socket.emit('FromClient.Query', query);
        });
    };

    const getAssetDataSets = (tracked, data) => {
        const filteredData = Object.keys(data)
                    .filter(assetKey => tracked.includes(assetKey))
                    .reduce((obj, key) => {
                        obj[key] = data[key];
                        return obj;
                    }, {});
        return Object.values(filteredData);
    }

    return (
        <div>
            <AssetSelector assets={availableAssets} handleSelect={updateAssetSelection}></AssetSelector>
            {trackedAssets.length > 0 ? <PriceChart assetDataSets={getAssetDataSets(trackedAssets, assetData)}></PriceChart> : 'Select some assets to get started'}
        </div>
    )
}