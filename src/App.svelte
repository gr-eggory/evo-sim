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
	let width: number;
	let height: number;
	const margin: Margin = { top: 40, right: 30, bottom: 70, left: 80 };
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
	<div class="substitute-main">
		<div class="config box">
			<form on:submit={addSimulation}>
				<label for="optimal">Optimal phenotype</label>
				<input bind:value={optimalInput} type="text" id="optimal" />
				<label for="offspring">Offspring per Generation</label>
				<input bind:value={offspringInput} type="number" id="offspring" />
				<label for="mutation-rate">Mutation rate</label>
				<input
					bind:value={mutationRateInput}
					type="number"
					step=".01"
					id="mutation-rate"
				/>
				<button type="submit" disabled={runSimulation}>Add Simulation</button>
			</form>
			<hr />
			<div>
				<button on:click={toggleSimulation}
					>{runSimulation && !allSimsFinished ? 'Stop' : 'Begin'} Simulation</button
				>
				<label for="log-checkbox">logorithmic</label>
				<input type="checkbox" bind:checked={logorithmic} id="log-checkbox" />
			</div>
		</div>
		<div class="graph box" bind:clientWidth={width} bind:clientHeight={height}>
			<Graph
				width={width - 20}
				height={height - 20}
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
		</div>
		<div class="sims box">
			<p>Optimal/Current</p>
			<p>Mutation Rate</p>
			<p>Children per Gen</p>
			<p>Generation</p>
			<p>Similarity</p>
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
		</div>
	</div>
	<!-- OLD STYLE -->
	<!-- <div style="padding-top: 4rem;">
		<div class="sim-generation-panel">
			<form on:submit={addSimulation}>
				<label for="optimal">Optimal phenotype</label>
				<input bind:value={optimalInput} type="text" id="optimal" />
				<label for="offspring">Offspring per Generation</label>
				<input bind:value={offspringInput} type="number" id="offspring" />
				<label for="mutation-rate">Mutation rate</label>
				<input
					bind:value={mutationRateInput}
					type="number"
					step=".01"
					id="mutation-rate"
				/>
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
	</div> -->
	<!-- OLD STYLE -->
</main>

<style>
	main {
		min-height: 100vh;
		background-color: whitesmoke;
	}

	.substitute-main {
		height: 100vh;
		background-color: whitesmoke;
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		grid-template-rows: repeat(5, minmax(0, 1fr));
		grid-template-areas:
			'c c c g g g g g g g g g'
			'c c c g g g g g g g g g'
			'c c c g g g g g g g g g'
			's s s s s s s s s s s s'
			's s s s s s s s s s s s';
		grid-gap: 3rem;
		padding: 2rem;
	}

	.box {
		background-color: white;
		border-radius: 4px;
		box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.5);
	}

	.config {
		grid-area: c;
		padding: 1rem;
		/* background-color: aqua; */
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.graph {
		grid-area: g;
	}

	.sims {
		grid-area: s;
		overflow-y: scroll;
		padding: .75rem;
		display: grid;
		grid-template-columns: 2fr repeat(4, 1fr);
		grid-template-rows: 50px;
		grid-auto-rows: 60px;
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

	input[type='checkbox'] {
		cursor: pointer;
	}
</style>
