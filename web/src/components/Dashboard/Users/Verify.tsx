import React, { FC } from 'react';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { SERVER_URL } from '../../../constants';
import { RolesEnum, UserContract } from '../../../contracts/user.contract';
import { Asker, formatCurrency, handleError } from '../../../helpers';
import { useNullable } from '../../../hooks';
import { userService } from '../../../services/user.service';
import Card from '../../Shared/Card';

type Props = {};

const Verify: FC<Props> = (props) => {
	const { userID: id } = useParams<{ userID: string }>();
	const [passenger, setPassenger] = useNullable<UserContract>();
	const history = useHistory();

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	const fetchPassenger = async () => {
		try {
			const passenger = await userService.fetchOne(id, { role: RolesEnum.PASSENGER });

			if (passenger.approved) {
				toastr.info('Passenger is already approved.', 'Notice');
				history.goBack();
			}

			setPassenger(passenger);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const approveUser = async () => {
		try {
			if (await Asker.notice(`Are you sure you want to approve this Passenger?`)) {
				await userService.update(id, { approved: true });
				toastr.info(`Passenger '${passenger?.lastName}, ${passenger?.firstName}' has been verified.`, 'Notice');
				history.goBack();
			}
		} catch (error) {
			handleError(error);
		}
	};

	const deleteUser = async () => {
		try {
			if (await Asker.danger(`Are you sure you want to reject the verification of this passenger?`)) {
				await userService.delete(id);
				toastr.info(`Passenger '${passenger?.lastName}, ${passenger?.firstName}' has been rejected.`, 'Notice');
				history.goBack();
			}
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		fetchPassenger();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container-fluid'>
			<Card title='Verify Passenger'>
				<p>
					Name: {passenger?.lastName}, {passenger?.firstName}
				</p>
				<p>Address: {passenger?.address}</p>
				<p>Wallet: {formatCurrency(passenger?.coins || 0)}</p>
				<p>Verification Photos:</p>
				<div className='my-2 container row'>
					{passenger?.files?.map((file, index) => (
						<div className='col-12 col-md-6 col-lg-4' key={index}>
							<img
								src={`${SERVER_URL}${file.url}`}
								alt={file.name}
								style={{ width: '100%', height: 'auto' }}
								className='rounded border shadow clickable'
								onClick={(e) => {
									e.preventDefault();
									const link = document.createElement('a');
									link.download = file.name;
									link.href = file.url;
									document.body.appendChild(link);
									link.click();
									document.body.removeChild(link);
									link.remove();
								}}
								title={file.name}
							/>
						</div>
					))}
				</div>
				<div className='d-flex'>
					<button
						className='btn btn-success btn-sm ml-auto'
						data-tip='Confirm Verification'
						onClick={(e) => {
							e.preventDefault();
							approveUser();
						}}>
						<i className='material-icons'>check</i>
					</button>
					<button
						className='btn btn-danger btn-sm ml-1'
						data-tip='Reject Verification'
						onClick={(e) => {
							e.preventDefault();
							deleteUser();
						}}>
						<i className='material-icons'>remove_circle_outline</i>
					</button>
				</div>
			</Card>
		</div>
	);
};

export default Verify;
