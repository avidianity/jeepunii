declare global {
	interface Window {
		$: JQueryStatic;
		jQuery: JQueryStatic;
	}

	interface HTMLButtonElement {
		disable(mode?: boolean): void;
	}
}

export {};
