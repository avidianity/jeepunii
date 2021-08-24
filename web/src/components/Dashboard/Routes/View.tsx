import axios from 'axios';
import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router';
import { LocationContract } from '../../../contracts/location.contract';
import Card from '../../Shared/Card';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { handleError } from '../../../helpers';

type Props = {};

const View: FC<Props> = (props) => {
	const { id } = useParams<{ id: string }>();
	const { data, isFetched, isError, error } = useQuery(['routes', id], async () => {
		const { data } = await axios.get<LocationContract>(`/locations/${id}`);
		return data;
	});
	const history = useHistory();

	if (isError) {
		handleError(error);
		history.goBack();
	}

	if (!isFetched || !data) {
		return null;
	}

	return (
		<div className='container'>
			<Card title='View Route'>
				<MapContainer center={[data.lat, data.lon]} zoom={13}>
					<TileLayer
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					<Marker position={[data.lat, data.lon]}></Marker>
				</MapContainer>
			</Card>
		</div>
	);
};

export default View;
