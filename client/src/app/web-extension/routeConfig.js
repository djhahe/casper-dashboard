import HomeIcon from 'assets/image/home-icon.svg';
import NFTIcon from 'assets/image/nft-menu-icon.svg';
import StakingIcon from 'assets/image/staking-icon.svg';
import MarketIcon from 'assets/image/market-icon.svg';
import APP_CONFIGS from '../../config';
import NFTs from '../../components/web-extension/NFTs';
import Wallets from '../../components/web-extension/Dashboard';
import Receive from '../../components/web-extension/Receive';
import Send from '../../components/web-extension/Send';
import Token from '../../components/web-extension/TokenInfo';
import DeployDetails from '../../components/web-extension/DeployDetails';
import { AddToken } from '../../components/web-extension/TokenInfo/AddToken';
import ConnectAccount from '../../components/web-extension/ConnectAccount';
import ConnectDevice from '../../components/web-extension/ConnectAccount/ConnectDevice';
import { AddPublicKey } from '../../components/web-extension/ConnectAccount/AddPublicKey';
import Settings from '../../components/web-extension/Settings';
import { NFTDetails } from '../../components/web-extension/NFTs/NFTDetails';
import Market from '../../components/web-extension/Market';
import Staking from '../../components/web-extension/Staking';
import { SearchValidator } from '../../components/web-extension/Common/SearchValidator';
import { Confirm } from '../../components/web-extension/Staking/Confirm';

let features;
try {
	features =
		typeof APP_CONFIGS.AVAILABLE_FEATURES === 'string'
			? JSON.parse(APP_CONFIGS.AVAILABLE_FEATURES)
			: APP_CONFIGS.AVAILABLE_FEATURES;
} catch (error) {
	features = undefined;
}

const routes = {
	// Routes in menu bar
	mainRoutes: [
		{ name: 'Home', route: '/', component: Wallets, icon: HomeIcon },
		{ name: 'Staking', route: '/staking', component: Staking, icon: StakingIcon },
		{ name: 'My NFTs', route: '/NFTs', component: NFTs, icon: NFTIcon },
		{ name: 'Market', route: '/market', component: Market, icon: MarketIcon },
	],
	// Routes which navigate from main routes
	innerRoutes: [
		{ name: 'receive', route: '/receive', component: Receive },
		{ name: 'send', route: '/send', component: Send },
		{ name: 'token', route: '/token', component: Token },
		{ name: 'deployDetails', route: '/deployDetails', component: DeployDetails },
		{ name: 'addToken', route: '/addToken', component: AddToken },
		{ name: 'Settings', route: '/settings', component: Settings },
		{ name: 'NFT Details', route: '/nftDetails', component: NFTDetails },
		{ name: 'Search Validator', route: '/searchValidator', component: SearchValidator },
		{ name: 'Confirm', route: '/confirm', component: Confirm },
	],
	// Routes which do not relate to main routes
	outerRoutes: [
		{ name: 'Connect Account', route: '/connectAccount', component: ConnectAccount },
		{ name: 'Add public key', route: '/addPublicKey', component: AddPublicKey },
		{ name: 'Connect Device', route: '/connectDevice', component: ConnectDevice },
	],
};
export default Object.keys(routes).reduce((out, key) => {
	return { ...out, [key]: features ? routes[key].filter((route) => features.includes(route.name)) : routes[key] };
}, {});
