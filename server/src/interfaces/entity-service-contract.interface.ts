import { Model } from 'src/models/model.entity';

export interface EntityServiceContract<T extends Model> {
	/**
	 * Fetch a collection of models.
	 */
	all(): Promise<T[]>;

	/**
	 * Fetch a single model.
	 *
	 * @param id The ID of the model
	 */
	find(id: number): Promise<T>;

	/**
	 * Create a model.
	 *
	 * @param data
	 */
	create(data: any): Promise<T>;

	/**
	 * Update a model.
	 *
	 * @param id The ID of the model
	 * @param data
	 */
	update(id: number, data: any): Promise<T>;

	/**
	 * Deletes a model.
	 *
	 * @param id The ID of the model.
	 */
	delete(id: number): Promise<T>;
}
