<script lang="ts">
	import type { Row, SimulationConfig } from './types/data';
	import type { Margin } from './types/layout';
	import Graph from './components/Graph/Graph.svelte';
	import Simulation from './components/Simulation/Simulation.svelte';
	import type { FormSubmitEvent } from './types/dom';

	const defaultOptimal = '';
	const defaultMutationRate = 0.01;
	const defulatOffspring = 20;

	let optimalInput = defaultOptimal;
	let mutationRateInput = defaultMutationRate;
	let offspringInput = defulatOffspring;

	let runSimulation = false;
	let simulationFinished = false;

	const initialSim: SimulationConfig = {
		identifier: '1',
		optimal: 'methinks it is like a weasel',
		mutationRate: 0.01,
		offspring: 25,
	};

	// GRAPH
	let simulations: SimulationConfig[] = [initialSim];
	let data: Row[] = [];
	// ------

	const addRow = (row: Row) => {
		data.push(row);
		data = data;
	};

	const addSimulation = (event: FormSubmitEvent) => {
		event.preventDefault();
		if (!optimalInput || !offspringInput) {
			return;
		}
		const identifier = `${simulations.length + 1}`;
		simulations = [
			...simulations,
			{
				identifier,
				optimal: optimalInput,
				mutationRate: mutationRateInput,
				offspring: offspringInput,
			},
		];
		optimalInput = defaultOptimal;
		mutationRateInput = defaultMutationRate;
		offspringInput = defulatOffspring;
	};

	const toggleSimulation = () => {
		runSimulation = !runSimulation;
		// if (simulationFinished) {
		// 	closestIndividual = randomAlphaString(optimal.length);
		// 	generation = 0;
		// 	simulationFinished = false;
		// 	data = [];
		// }
	};
	// GRAPH SECTION
	const width = 800;
	const height = 500;
	const margin: Margin = { top: 20, right: 30, bottom: 65, left: 90 };
	const xAxisLabelOffset = 50;
	const yAxisLabelOffset = 45;

	const xAxisLabel = 'Generation';
	const xValue = (d: Row) => d.generation;

	const yAxisLabel = 'Similarity';
	const yValue = (d: Row) => d.similarity;

	const zValue = (d: Row | { identifier: string }) => d.identifier;
	$: zDomain = simulations.map(zValue);
</script>

<main>
	<div class="sim-generation-panel">
		<form on:submit={addSimulation}>
			<input bind:value={optimalInput} type="text" />
			<input bind:value={offspringInput} type="number" />
			<input bind:value={mutationRateInput} type="number" step=".01" />
			<button type="submit">Submit</button>
		</form>
	</div>
	{#each simulations as { identifier, optimal, mutationRate, offspring } (identifier)}
		<Simulation
			{identifier}
			{optimal}
			{mutationRate}
			{offspring}
			{addRow}
			{runSimulation}
		/>
	{/each}
	<button on:click={toggleSimulation}
		>{runSimulation && !simulationFinished ? 'Stop' : 'Begin'} Simulation</button
	>
	<section class="output-grid">
		<Graph
			{width}
			{height}
			{data}
			{xValue}
			{yValue}
			{zValue}
			{zDomain}
			{margin}
			{xAxisLabelOffset}
			{yAxisLabelOffset}
			{xAxisLabel}
			{yAxisLabel}
		/>
	</section>
</main>

<style>
	main {
		min-height: 100vh;
		background-color: whitesmoke;
		padding-top: 5rem;
	}

	.output-grid {
		/* display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); */
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	button {
		cursor: pointer;
	}
</style>
