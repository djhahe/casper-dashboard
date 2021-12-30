import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Heading from './Heading';

afterEach(cleanup);
jest.mock('../../../../selectors/signer', () => {
	return {
		__esModule: true,
		getSignerStatus: () => {},
		isConnectedCasper: () => {
			return new Promise((resolve) => {
				resolve('connected');
			});
		},
	};
});

let spyOnUseSelector;
let spyOnUseDispatch;
let mockDispatch;
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
	// Mock useDispatch hook
	spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
	// Mock dispatch function returned from useDispatch
	mockDispatch = jest.fn();
	spyOnUseDispatch.mockReturnValue(mockDispatch);
});

test('Should show Connect Ledger if no public key', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce(undefined);
	const { getByText } = render(<Heading />);
	expect(getByText('Connect Ledger').textContent).toBe('Connect Ledger');
});

test('Should show error if input invalid public key', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce(undefined);
	const { getByText, getByPlaceholderText } = render(<Heading />);
	const viewModeBtn = getByText('View Mode');
	expect(viewModeBtn.textContent).toBe('View Mode');
	fireEvent.click(viewModeBtn);
	const input = getByPlaceholderText('Public key');
	fireEvent.change(input, { target: { value: 'test' } });
	const viewBtn = getByText('View');
	fireEvent.click(viewBtn);
	expect(getByText('Invalid public key').textContent).toBe('Invalid public key');
});

test('Should show public key if enter valid public key', async () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce(undefined);
	const { getByText, getByPlaceholderText } = render(<Heading />);
	const viewModeBtn = getByText('View Mode');
	expect(viewModeBtn.textContent).toBe('View Mode');
	fireEvent.click(viewModeBtn);
	const input = getByPlaceholderText('Public key');
	fireEvent.change(input, {
		target: { value: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad' },
	});
	const viewBtn = getByText('View');
	fireEvent.click(viewBtn);
	expect(input.value).toBe('0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad');
});

test('Should show public key if connected and unlocked casper sign', () => {
	spyOnUseSelector
		.mockReturnValue([])
		.mockReturnValueOnce('testaddress')
		.mockReturnValueOnce({ isConnected: true, isUnlocked: true });
	const { getByText } = render(<Heading />);

	expect(getByText('testad').textContent).toBe('testad');
});

test('Should not show view mode if have public key', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce('testaddress');

	const { queryByText } = render(<Heading />);

	expect(queryByText('View Mode')).toBe(null);
});

test('Should change theme', () => {
	const { container, baseElement } = render(<Heading />);
	const switchThemeBtn = container.querySelector('.cd_theme_switch');

	fireEvent.click(switchThemeBtn);
	expect(baseElement.querySelector('cd_page_dark_mode')).toBe(null);
});
