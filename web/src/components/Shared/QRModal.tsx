import axios from 'axios';
import React, { createRef, FC, useEffect } from 'react';
import { QRCode } from '../../helpers';
import { useNullable } from '../../hooks';

type Props = {
	url: string;
	buttonClassName: string;
	title: string | JSX.Element | JSX.Element[];
	props?: any;
	modalTitle?: string;
};

const QRModal: FC<Props> = ({ url, title, buttonClassName, props, modalTitle }) => {
	const [data, setData] = useNullable<string>();
	const [modal, setModal] = useNullable<JQuery<HTMLDivElement>>();
	const ref = createRef<HTMLDivElement>();

	const qrCodify = async (url: string) => {
		try {
			const { data } = await axios.get<string>(url);
			setData(await QRCode.toDataURL(data));
		} catch (error) {
			console.log(error);
			toastr.error('Unable to generate QR Code.');
		}
	};

	useEffect(() => {
		qrCodify(url);
		// eslint-disable-next-line
	}, []);

	const toggleModal = (event: React.MouseEvent<Element, MouseEvent>) => {
		event.preventDefault();
		modal?.modal('toggle');
	};

	const dismissModal = (event: React.MouseEvent<Element, MouseEvent>) => {
		event.preventDefault();
		modal?.modal('hide');
	};

	useEffect(() => {
		if (ref.current && !modal) {
			setModal($(ref.current));
		}
	}, [ref, setModal, modal]);

	return (
		<>
			<button type='button' className={`${buttonClassName}`} onClick={toggleModal} {...props}>
				{title}
			</button>
			<div ref={ref} className='modal fade' tabIndex={-1}>
				<div className='modal-dialog modal-dialog-centered'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>{modalTitle}</h5>
							<button type='button' className='close' onClick={dismissModal}>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body d-flex align-items-center justify-content-center'>
							{data ? <img src={data} alt='QR Code' className='img-fluid m-3' /> : null}
						</div>
						<div className='modal-footer'>
							{data ? (
								<button
									className='btn btn-primary btn-sm btn-icon'
									onClick={() => {
										const link = document.createElement('a');
										link.download = `${modalTitle || `qrcode`}.png`;
										link.href = data;
										document.body.appendChild(link);
										link.click();
										document.body.removeChild(link);
										link.remove();
									}}>
									<i className='material-icons'>download</i>
								</button>
							) : null}
							<button className='btn btn-secondary btn-sm' onClick={dismissModal}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default QRModal;
