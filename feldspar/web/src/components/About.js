import { Link } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function About() {
    return (
        <div>
            <Typography paragraph>
                Feldspar is a market data visualization engine.
                Click on the Asset Visualizer to get started!
            </Typography>
            <Typography paragraph>
                The App Service Plan is not very high-powered to keep the Azure bill low, so please don't go crazy trying to break the page.
                This is a work in progress, so there are some bugs as well!
            </Typography>
            <Typography paragraph>
                Take a look at the source code on
                <Link href='https://github.com/jameselliothart/feldspar'>
                    GitHub
                </Link>
            </Typography>
        </div>
    )
}