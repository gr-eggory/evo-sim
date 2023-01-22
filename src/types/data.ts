export interface Row {
	identifier: string;
	generation: number;
	similarity: number;
}

export interface SimulationConfig {
	identifier: string;
	optimal: string;
	mutationRate: number;
	offspring: number;
}
