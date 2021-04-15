import { useState } from 'react';

export function useNullable<T>(data?: T) {
	return useState<T | null>(data || null);
}
