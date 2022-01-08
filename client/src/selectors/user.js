import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { getConfigurations } from '../services/configurationServices';
import { convertBalanceFromHex } from '../helpers/balance';
import { getBase64IdentIcon } from '../helpers/identicon';
import { USERS } from '../store/actionTypes';
import { getCurrentPrice } from './price';
import { getMassagedTokenData } from './tokens';

const configurations = getConfigurations();

const CSPR_INFO = {
	symbol: 'CSPR',
	address: 'CSPR',
	transferFee: configurations.CSPR_TRANSFER_FEE,
	minAmount: configurations.MIN_CSPR_TRANSFER,
	icon: 'assets/images/token-icons/cspr.png',
};

export const getPublicKey = ({ user }) => {
	return user.publicKey;
};

export const getLoginOptions = ({ user }) => {
	return user.loginOptions || {};
};

export const userDetailsSelector = getQuerySelector({ type: USERS.FETCH_USER_DETAILS });

export const getMassagedUserDetails = createSelector(userDetailsSelector, (userDetails) => {
	const data = userDetails.data || {};
	const hexBalance = data && data.balance ? data.balance.hex : 0;
	return {
		...data,
		balance: {
			...data.balance,
			mote: parseInt(hexBalance),
			displayBalance: convertBalanceFromHex(hexBalance),
		},
	};
});

export const getAllTokenInfo = createSelector(
	getMassagedUserDetails,
	getCurrentPrice,
	getMassagedTokenData,
	(accountDetails, CSPRPrice, tokensData) => {
		const CSPRBalance = (accountDetails && accountDetails.balance && accountDetails.balance.displayBalance) || 0;
		const CSPRInfo = {
			...CSPR_INFO,
			balance: { displayValue: CSPRBalance },
			price: CSPRPrice,
			totalPrice: CSPRPrice * CSPRBalance,
		};

		//TODO: should get price for each token, currently no token issue on Casper blockchain and no source as well
		// Temporary set the token price to 0
		const tokenPrice = 0;
		const tokensInfo =
			tokensData && tokensData.length
				? tokensData.map((datum) => ({
						price: tokenPrice,
						totalPrice: tokenPrice * datum.balance.displayValue,
						transferFee: configurations.TOKEN_TRANSFER_FEE,
						icon: getBase64IdentIcon(datum.address),
						...datum,
				  }))
				: [];

		return [CSPRInfo, ...tokensInfo];
	},
);

export const getAccountTotalBalanceInFiat = createSelector(getAllTokenInfo, (allTokenInfo) => {
	return allTokenInfo && allTokenInfo.length
		? allTokenInfo.reduce((out, datum) => {
				return out + datum.totalPrice;
		  }, 0)
		: 0;
});

export const getTokenInfoByAddress = (token) =>
	createSelector(getAllTokenInfo, (allTokenInfo) => {
		return token && allTokenInfo && allTokenInfo.length
			? allTokenInfo.find((info) => info.address === token.address)
			: {};
	});
