import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(asset, assetKeys, theme) {
    return {
        fontWeight:
            assetKeys.findIndex(a => a.key === asset.key) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function AssetSelector({ assets, handleSelect }) {
    const theme = useTheme();
    const [selectedAssetKeys, setSelectedAssetKeys] = React.useState([]);

    const handleChange = (event) => {
        const assetKey = event.target.value;
        // On autofill we get a stringified value.
        const selected = typeof assetKey === 'string' ? assetKey.split(',') : assetKey;
        setSelectedAssetKeys(selected);
        handleSelect(selected);
    };

    const menuItems = assets.map(asset => {
        return (
            <MenuItem
                key={asset.key}
                value={asset.key}
                style={getStyles(asset, selectedAssetKeys, theme)}
            >
                {asset.name}
            </MenuItem>
        )
    });

    const getChips = (assets, assetKeys) => {
        return assets
            .filter(asset => assetKeys.includes(asset.key))
            .map(asset => <Chip key={asset.key} label={asset.name} />)
    }

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="asset-selector-label">Commodities</InputLabel>
                <Select
                    labelId="asset-selector-label"
                    id="asset-selector"
                    multiple
                    value={selectedAssetKeys}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Commodities" />}
                    renderValue={(assetKeys) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {getChips(assets, assetKeys)}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {menuItems}
                </Select>
            </FormControl>
        </div>
    );
}