import { useRouteMatch } from 'react-router-dom';

export function useURL() {
	const match = useRouteMatch();

	return (path: string) => `${match.path}${path}`;
}
