<script lang="ts">
	import type { Row, SimulationConfig } from './types/data';
	import { State } from './types/data';
	import type { Margin } from './types/layout';
	import Graph from './components/Graph/Graph.svelte';
	import Simulation from './components/Simulation/Simulation.svelte';
	import type { FormSubmitEvent } from './types/dom';
	import { allSimsReady } from './util';
	import { scaleOrdinal, schemeSet1 } from 'd3';

	const defaultOptimal = '';
	const defaultMutationRate = 0.01;
	const defulatOffspring = 20;

	let optimalInput = defaultOptimal;
	let mutationRateInput = defaultMutationRate;
	let offspringInput = defulatOffspring;

	let runSimulation = false;
	let logorithmic = false;

	const initialSim: SimulationConfig = {
		id: 0,
		optimal: 'methinks it is like a weasel',
		mutationRate: 0.01,
		offspring: 25,
	};

	// GRAPH
	let simulations: SimulationConfig[] = [initialSim];
	let data: Row[] = [];
	$: simStates = allSimsReady(simulations.length);
	let allSimsFinished = false;
	// ------

	const addRow = (row: Row) => {
		data.push(row);
		data = data;
	};

	const dispatchState = (id: number, state: State): void => {
		simStates[id] = state;
		const allSimsAreNowFinished = simStates.every(
			(sim) => sim === State.I_HAVE_FINISHED
		);
		if (!allSimsAreNowFinished) {
			return;
		}
		runSimulation = false;
		allSimsFinished = true;
		return;
	};

	const addSimulation = (event: FormSubmitEvent) => {
		event.preventDefault();
		if (!optimalInput || !offspringInput) {
			return;
		}
		const cleanedOptimal = optimalInput
			.toLowerCase()
			.replaceAll(/[^a-z\s]/g, '')
			.trim();
		if (!cleanedOptimal) {
			return;
		}
		const id = simulations.length;
		simulations = [
			...simulations,
			{
				id,
				optimal: cleanedOptimal,
				mutationRate: mutationRateInput,
				offspring: offspringInput,
			},
		];
		optimalInput = defaultOptimal;
		mutationRateInput = defaultMutationRate;
		offspringInput = defulatOffspring;
	};

	const toggleSimulation = () => {
		if (allSimsFinished) {
			data = [];
			simStates = allSimsReady(simulations.length);
			allSimsFinished = false;
		}
		runSimulation = !runSimulation;
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

	const zValue = (d: Row | { id: number }) => d.id;
	$: zDomain = simulations.map(({ id }) => `${id}`);
	$: colorScale = scaleOrdinal().domain(zDomain).range(schemeSet1) as (
		id: string
	) => string;
	$: alteredData = logorithmic
		? data.map((d) => ({ ...d, generation: Math.log10(d.generation) }))
		: data;
</script>

<main>
	<!-- <div class="substitute-main">
		<div class="config box" />
		<div class="graph box" />
		<div class="sims box" />
	</div> -->
	<div style="padding-top: 4rem;">
		<div class="sim-generation-panel">
			<form on:submit={addSimulation}>
				<label for="optimal">Optimal phenotype</label>
				<input bind:value={optimalInput} type="text" id="optimal" />
				<label for="offspring">Offspring per Generation</label>
				<input bind:value={offspringInput} type="number" id="offspring" />
				<label for="mutation-rate">Mutation rate</label>
				<input bind:value={mutationRateInput} type="number" step=".01" id="mutation-rate" />
				<button type="submit" disabled={runSimulation}>Submit</button>
			</form>
		</div>
		{#each simulations as { id, optimal, mutationRate, offspring } (id)}
			<Simulation
				{id}
				{optimal}
				{mutationRate}
				{offspring}
				textColor={colorScale(`${id}`)}
				{addRow}
				{dispatchState}
				{runSimulation}
				{allSimsFinished}
			/>
		{/each}
		<button on:click={toggleSimulation}
			>{runSimulation && !allSimsFinished ? 'Stop' : 'Begin'} Simulation</button
		>
		<label for="log-checkbox">logorithmic</label>
		<input type="checkbox" bind:checked={logorithmic} id="log-checkbox" />
		<section class="output-grid">
			<Graph
				{width}
				{height}
				data={alteredData}
				{xValue}
				{yValue}
				{zValue}
				{colorScale}
				{margin}
				{xAxisLabelOffset}
				{yAxisLabelOffset}
				{xAxisLabel}
				{yAxisLabel}
			/>
		</section>
	</div>
</main>

<style>
	main {
		min-height: 100vh;
		background-color: whitesmoke;
	}

	.substitute-main {
		--gap: 3rem;
		min-height: 100vh;
		background-color: whitesmoke;
		display: grid;
		grid-template-areas:
			'c c c c g g g g g g g g'
			'c c c c g g g g g g g g'
			'c c c c g g g g g g g g'
			's s s s s s s s s s s s'
			's s s s s s s s s s s s';
		grid-gap: 4rem;
		padding: 3rem;
	}

	.box {
		border-radius: 4px;
		box-shadow: 1px 3px 8px rgba(0, 0, 0, 0.6);
	}

	.config {
		grid-area: c;
		background-color: aqua;
	}

	.graph {
		grid-area: g;
		background-color: crimson;
	}

	.sims {
		grid-area: s;
		background-color: chartreuse;
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

	input[type='checkbox'],
	label {
		cursor: pointer;
	}
</style>
