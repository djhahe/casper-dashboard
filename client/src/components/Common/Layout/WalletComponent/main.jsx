import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AllTransactionList from '../TransactionList/AllTransactionList';
import { SendReceiveSection } from './SendReceiveSection';
import { getMassagedUserDetails, getPublicKey } from '../../../../selectors/user';
import { formatKeyByPrefix } from '../../../../helpers/key';

const MainComponent = ({ name, value, updown, price }) => {
	// send btn
	const [send, setSend] = useState(false);

	const handleToggle = () => {
		setSend(!send);
	};

	const userDetails = useSelector(getMassagedUserDetails);
	const publicKey = useSelector(getPublicKey);

	const displayBalance = userDetails && userDetails.balance ? userDetails.balance.displayBalance : 0;

	return (
		<>
			<div className="zl_setting_list">
				<div className="zl_setting_list_items">
					<div className="zl_setting_items_heading_peregraph">
						<h3>Account Info</h3>
						<Table className="zl_account_info_table">
							<tbody>
								<tr>
									<td>Public Key</td>
									<td>
										<span>{publicKey}</span>
									</td>
								</tr>
								<tr>
									<td>Account Hash</td>
									<td>{formatKeyByPrefix(userDetails._accountHash)}</td>
								</tr>
							</tbody>
						</Table>
					</div>
				</div>
			</div>
			<div className={`zl_chart_component ${send ? 'active' : ''}`}>
				<div className="zl_all_page_comman_content">
					<div className="zl_chart_box_heading_date">
						<h2 className="zl_chart_box_heading">
							<div className="zl_add_currency_icon_chart">
								<img src="assets/image/cspr.png" alt="currency-icon" />
							</div>
							{name}
						</h2>
					</div>

					<div className="zl_wallet_chart_bottom_content">
						<div className="zl_all_page_comman_total_price">
							<p className="zl_all_page_total_price_heading">Total Balance</p>
							<h2 className="zl_all_page_total_price_text">{displayBalance}</h2>
						</div>
						<div className="zl_wallet_chart_send_receive_btn">
							<Button className="zl_wallet_chart_send_btn" onClick={handleToggle}>
								<svg
									width="15"
									height="15"
									viewBox="0 0 6 6"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z"
										fill="#252F47"
									/>
								</svg>
								Send
							</Button>
							<Button className="zl_wallet_chart_receive_btn" onClick={handleToggle}>
								<svg
									width="15"
									height="15"
									viewBox="0 0 6 6"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3.60609 3.60609L2.69695 4.51523C2.36222 4.84996 1.81951 4.84996 1.48477 4.51523C1.15004 4.18049 1.15004 3.63778 1.48477 3.30305L2.39391 2.39391L0 0H6V6L3.60609 3.60609Z"
										fill="#252F47"
									/>
								</svg>
								Receive
							</Button>
						</div>
					</div>
				</div>
				<SendReceiveSection
					handleToggle={handleToggle}
					displayBalance={displayBalance}
					fromAddress={publicKey}
				/>
				<div className="zl_transaction_list">
					<h3 className="zl_transaction_list_main_heading">
						Transaction
						<Link to={'/history'}>See All</Link>
					</h3>
					<AllTransactionList value={value} />
				</div>
			</div>
		</>
	);
};

export default MainComponent;
