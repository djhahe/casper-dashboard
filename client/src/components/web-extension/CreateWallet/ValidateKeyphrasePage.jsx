import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import every from 'lodash-es/every';
import { generateCWHeader, onGenerateWordcheck } from '@cd/actions/createWalletActions.utils';
import { setNextStep, updateAnswerSheet, createAnswerSheet } from '@cd/actions/createWalletActions';
import { selectCreateWalletState } from '@cd/selectors/createWallet';
import { CONSTANTS } from '@cd/shared/constants';
import { sharesToMnemonicArrays } from '@cd/helpers/shareable';
import WordsGroup from './WordsGroup';
import './ValidateKeyphrase.scss';

const ValidateKeyphrasePage = () => {
	const [, setHeader] = useOutletContext();
	const dispatch = useDispatch();
	const { currentStep, answerSheet, keyPhrase: keyPhraseShares } = useSelector(selectCreateWalletState);
	const [wordsTemplate, setTemplate] = useState(undefined);
	const onUpdateAnswerSheet = useCallback(
		(groupIndex, value) => dispatch(updateAnswerSheet(groupIndex, value)),
		[dispatch],
	);
	const onCreateAnswerSheet = useCallback((checklist) => dispatch(createAnswerSheet(checklist)), [dispatch]);

	const totalWords = sharesToMnemonicArrays(keyPhraseShares).length;
	const totalWordCheck = totalWords / 3;

	const shouldDisableNextButton = useMemo(() => {
		//can skip if debugging
		if (CONSTANTS.DEBUG_ENV) {
			return false;
		}
		if (answerSheet) {
			return every(answerSheet, Boolean) ? false : true;
		}
		return true;
	}, [answerSheet]);

	const onClickHandler = useCallback(() => {
		if (shouldDisableNextButton) {
			return;
		}

		dispatch(setNextStep());
	}, [dispatch, shouldDisableNextButton]);

	const onSelecteWordHandler = useCallback(
		(groupIndex, answer) => {
			//can skip if debugging
			if (!answerSheet && !CONSTANTS.DEBUG_ENV) {
				return;
			}

			const newTemplate = wordsTemplate.map((each, index) => {
				if (index === groupIndex) {
					return {
						...each,
						value: answer,
					};
				}

				return each;
			});
			setTemplate(newTemplate);

			if (wordsTemplate[groupIndex].answer?.text === answer) {
				onUpdateAnswerSheet(groupIndex, true);
			} else {
				onUpdateAnswerSheet(groupIndex, false);
			}
		},
		[answerSheet, onUpdateAnswerSheet, wordsTemplate],
	);

	useEffect(() => {
		const header = generateCWHeader(currentStep, answerSheet);

		setHeader(header);
	}, [answerSheet, currentStep, setHeader]);

	/**
	 * Run only once
	 * Generate answer array from index to actual word
	 */
	useEffect(() => {
		if (wordsTemplate) {
			return;
		}

		const getChecks = () => {
			const mnemonics = sharesToMnemonicArrays(keyPhraseShares);
			const { checklist, data } = onGenerateWordcheck(totalWords, totalWordCheck);
			onCreateAnswerSheet(checklist);

			return checklist.map((id) => {
				const arr = data[id].options.map((wordId) => mnemonics[wordId]);
				return {
					answer: { id, text: mnemonics[id] },
					value: null,
					options: arr,
				};
			});
		}

		setTemplate(getChecks());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (currentStep !== 1 || !wordsTemplate?.length) {
		return null;
	}

	return (
		<div className="cd_we_create-wallet-layout--root">
			<div className="cd_we_create-wallet-layout--body cd_we_validate-keyphrase--body">
				<p>You need to choose {totalWordCheck} correct words to complete</p>
				<div className="cd_we_validate-keyphrase--wrapper">
					{wordsTemplate.map((group, groupIndex) => {
						return (
							<WordsGroup
								key={`group-${groupIndex}`}
								groupIndex={groupIndex}
								onSelect={onSelecteWordHandler}
								data={group}
							/>
						);
					})}
				</div>
			</div>
			<div className="cd_we_page--bottom">
				<Button className="cd_we_btn-next" onClick={onClickHandler} disabled={shouldDisableNextButton}>
					Next
				</Button>
			</div>
		</div>
	);
};

export default ValidateKeyphrasePage;
