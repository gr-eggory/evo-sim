export interface Row {
	identifier: string;
	generation: number;
	similarity: number;
}

export interface SimulationConfig {
	identifier: string;
	runSimulation: boolean;
	optimal: string;
	mutationRate: number;
	addRow: (row: Row) => void;
}
