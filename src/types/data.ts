export interface Row {
	id: number;
	generation: number;
	similarity: number;
	phenotype: string;
}

export interface SimulationConfig {
	id: number;
	optimal: string;
	mutationRate: number;
	offspring: number;
}

export enum State {
	READY_TO_RUN = 'ready to run',
	I_HAVE_FINISHED = 'I have finished',
	RUNNING = 'running',
}
