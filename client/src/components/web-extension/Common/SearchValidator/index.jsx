import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getValidators, validatorSelector } from '@cd/selectors/validator';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import Grid from '@cd/web-extension/Common/Grid';
import { FeeTooltip } from './FeeTooltip';

import './SearchValidator.scss';

const VALIDATOR_METADATA = {
	left: [
		{ key: 'name', type: 'primary', wrapperComponent: MiddleTruncatedText },
		{ key: 'validatorPublicKey', type: 'primary', wrapperComponent: MiddleTruncatedText },
	],
	right: [
		{ key: 'delegationRate', format: 'percentage', suffix: 'Fee', wrapperComponent: FeeTooltip },
		{ key: 'totalStaked', format: 'mote' },
	],
};

export const SearchValidator = () => {
	// State
	const [searchTerm, setSearchTerm] = useState();

	// Selector
	const validators = useSelector(getValidators(searchTerm));
	const { loading } = useSelector(validatorSelector);

	// Hook
	const { state } = useLocation();
	const navigate = useNavigate();

	// Function
	const onValidatorClick = (validator) => {
		navigate('/staking', { state: { ...state, validator } });
	};

	return (
		<section className="cd_we_validator_search">
			<div className="cd_we_validator_search_input">
				<div className="cd_we_input_label">Validator</div>
				<input
					placeholder="Enter validator"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className="cd_we_validator_list">
				<div className="cd_we_input_label">Validator List ({validators.length})</div>
				<Grid
					data={validators}
					metadata={VALIDATOR_METADATA}
					className="overflow_auto hide_scroll_bar"
					onRowClick={onValidatorClick}
					isLoading={loading}
				/>
			</div>
		</section>
	);
};
