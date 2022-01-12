/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import { buildAccountWeightDeploy } from '../../../services/keyManager';
import KeyManager from './index';

//Set up
jest.mock('../../../actions/keyManagerActions', () => {
	//Mock the default export and named export 'foo'
	return {
		__esModule: true,
		fetchKeyManagerDetails: jest.fn(),
		putWeightDeploy: jest.fn(),
		deployKeyManagerContract: jest.fn(),
		updateKeysManagerLocalStorage: jest.fn(),
		getKeysManagerLocalStorage: jest.fn(),
		getKeysManagerPendingDeploys: jest.fn(),
		updateKeysManagerDeployStatus: jest.fn(),
	};
});

jest.mock('../../../services/keyManager', () => {
	//Mock the default export and named export 'foo'
	return {
		__esModule: true,
		buildAccountWeightDeploy: jest.fn(),
	};
});

jest.mock('../../Common/Layout/HeadingComponent/Heading', () => {
	return {
		__esModule: true,
		default: () => {
			return <div />;
		},
	};
});

jest.mock('../../Common/SendReceive', () => {
	return {
		__esModule: true,
		SendReceiveSection: () => {
			return <div />;
		},
	};
});

afterEach(cleanup);
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

// Test

test('Show no account with key management info ', async () => {
	spyOnUseSelector.mockReturnValue([]);

	const { getByText, container } = render(<KeyManager />);
	expect(getByText(/Account Info/i).textContent).toBe('Account Info');
	expect(getByText(/Public Key/i).textContent).toBe('Public Key');
	expect(getByText('Account Hash').textContent).toBe('Account Hash');
	expect(getByText('Weight').textContent).toBe('Weight');
	expect(getByText(/Action Thresholds/i).textContent).toBe('Action Thresholds');
	expect(getByText(/Deployment/i).textContent).toBe('Deployment');
	expect(getByText(/Key Management/i).textContent).toBe('Key Management');
	const addKeyBtn = container.querySelector('.bi-plus-circle');
	fireEvent.click(addKeyBtn);
	expect(getByText(/Edit Key/i).textContent).toBe('Edit Key');
	buildAccountWeightDeploy.mockReturnValue({});
	mockDispatch.mockReturnValue({ data: { hash: 'test' } });
	await act(async () => {
		fireEvent.click(getByText(/Save/i));
	});
	expect(getByText(/Edit Key/i).textContent).toBe('Edit Key');
});
