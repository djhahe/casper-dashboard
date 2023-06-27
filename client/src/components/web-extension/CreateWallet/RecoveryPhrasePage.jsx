import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import drop from 'lodash-es/drop';
import dropRight from 'lodash-es/dropRight';
import { generateKeyphrase, setNextStep } from '@cd/actions/createWalletActions';
import SelectEncryptionType from '@cd/web-extension/Common/SelectEncryptionType';
import NumberRecoveryWordsSelect from '@cd/web-extension/Common/NumberRecoveryWordsSelect';
import CopyButton from '@cd/web-extension/Common/CopyButton';
import { selectCreateWalletKeyphraseAsMap, selectCreateWalletKeyphrase } from '@cd/selectors/createWallet';
import { NUMBER_OF_RECOVERY_WORDS } from '@cd/constants/key';
import { ONE_MINUTE } from '@cd/constants/time';
import CanvasText from '@cd/web-extension/Common/CanvasText/index';

import './RecoveryPhrasePage.scss';

const RecoveryPhrasePage = () => {
	const dispatch = useDispatch();
	const [numOfWords, setNumOfWords] = useState(NUMBER_OF_RECOVERY_WORDS[0]);
	let keyPhrase = useSelector(selectCreateWalletKeyphrase);
	let keyPhraseAsMap = useSelector(selectCreateWalletKeyphraseAsMap);
	let keyPhraseAsArray = Array.from(keyPhraseAsMap.values());

	const TOTAL_KEYWORDS = keyPhraseAsArray.length;
	const leftKeys = dropRight(keyPhraseAsArray, TOTAL_KEYWORDS / 2);
	const rightKeys = drop(keyPhraseAsArray, TOTAL_KEYWORDS / 2);

	const onClickNextHandler = useCallback(() => {
		dispatch(setNextStep());
	}, [dispatch]);

	useEffect(() => {
		dispatch(generateKeyphrase(numOfWords));
	}, [numOfWords, dispatch]);

	useEffect(() => {
		// clean up keyphrase
		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			keyPhrase = '';
			// eslint-disable-next-line react-hooks/exhaustive-deps
			keyPhraseAsMap = new Map();
			// eslint-disable-next-line react-hooks/exhaustive-deps
			keyPhraseAsArray = [];
		};
	}, []);

	return (
		<div className="cd_we_create-wallet-layout--root">
			<SelectEncryptionType />
			<NumberRecoveryWordsSelect
				selectedValue={numOfWords}
				onChange={(number) => {
					setNumOfWords(number);
				}}
			/>
			<div className="cd_we_create-wallet-layout--body cd_we_create-keyphrase--box">
				<ul className="cd_we_create-keyphrase--column">
					{leftKeys?.map((word, index) => (
						<li className="cd_we_keyphrase--word" key={`left-${word}`}>
							<CanvasText text={`${index + 1}. ${word}`} width="80" height="22" />
						</li>
					))}
				</ul>
				<ul className="cd_we_create-keyphrase--column">
					{rightKeys?.map((word, index) => (
						<li className="cd_we_keyphrase--word" key={`right-${word}`}>
							<CanvasText text={`${index + (1 + TOTAL_KEYWORDS / 2)}. ${word}`} width="80" height="22" />
						</li>
					))}
				</ul>
			</div>
			<div className="cd_we_create-keyphrase--actions">
				<CopyButton className="cd_we_create-keyphrase__btn" text={keyPhrase} delay={ONE_MINUTE} />
				<Button onClick={onClickNextHandler} className="cd_we_create-keyphrase__btn">
					Next
				</Button>
			</div>
		</div>
	);
};

export default RecoveryPhrasePage;
