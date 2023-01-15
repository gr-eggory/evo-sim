<script lang="ts">
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { scaleLinear, extent, line, curveNatural, max } from 'd3';

	import type { Row } from './types/data';
	import type { Margin } from './types/layout';
	import Graph from './components/Graph/Graph.svelte';
	import {
		randomAlphaString,
		generateChildren,
		findBestChild,
		Child,
		similarity,
		prettifyPercent,
	} from './util';

	let runSimulation = false;
	let input = '';
	let optimal = 'methinks it is like a weasel';
	let interval: NodeJS.Timer;
	let simulationFinished = false;

	let mutationRate = 0.01;
	let offspring = 25;
	let generation = 0;

	// GRAPH
	let data: Row[] = [];
	// ------

	$: closestIndividual = randomAlphaString(optimal.length);
	$: currentSimilarity = similarity(closestIndividual, optimal);
	$: children = generateChildren(closestIndividual, mutationRate, offspring);

	const assignOptimal = (e) => {
		e.preventDefault();
		optimal = input;
	};

	const toggleSimulation = () => {
		runSimulation = !runSimulation;
		if (simulationFinished) {
			closestIndividual = randomAlphaString(optimal.length);
			generation = 0;
			simulationFinished = false;
			data = [];
		}
	};

	const beginSimulation = () => {
		interval = setInterval(() => {
			const newBest = findBestChild(children, optimal);
			closestIndividual = newBest.text;
			currentSimilarity = newBest.closeenessToOptimal;
			children = generateChildren(closestIndividual, mutationRate, offspring);
			data = [
				...data,
				{ identifier: `${1}`, generation, similarity: currentSimilarity * 100 },
			];
			if (closestIndividual === optimal) {
				clearInterval(interval);
				simulationFinished = true;
				runSimulation = false;
			}
			generation++;
		}, 10);
	};

	$: runSimulation ? beginSimulation() : clearInterval(interval);

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

	// ---------
</script>

<main>
	<div class="sim-generation-panel">
		<form on:submit={assignOptimal}>
			<input type="text" bind:value={input} />
		</form>
		<button on:click={toggleSimulation}
			>{runSimulation && !simulationFinished ? 'Stop' : 'Begin'} Simulation</button
		>
	</div>
	<section class="output-grid">
		<div class="simulation-configs-list">
			<h3 class="optimal__label">Optimal:</h3>
			<h2 class="optimal__value">{optimal}</h2>
			<h3 class="success__label">Current phenotype:</h3>
			<h2 class="success__value">{closestIndividual}</h2>
			<h4>Similarity: {prettifyPercent(currentSimilarity)}</h4>
			<h3 class="generation">Generation: {generation}</h3>
		</div>
		<div class="graph-container">
			<Graph
				{width}
				{height}
				{data}
				{xValue}
				{yValue}
				{margin}
				{xAxisLabelOffset}
				{yAxisLabelOffset}
				{xAxisLabel}
				{yAxisLabel}
			/>
		</div>
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

	.simulation-configs-list {
		flex: 0 0 800px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		align-content: flex-start;
	}

	.optimal__label {
		grid-column: 1;
	}

	.optimal__value {
		grid-column: 2;
	}

	.success__label {
		grid-column: 1;
	}

	.generation {
		grid-column: 2;
	}

	.graph-container {
		background-color: #efecea;
		flex: 0 0 800px;
		height: 500px;
	}

	.tick line {
		stroke: #c0c0bb;
	}

	.tick-label {
		fill: #635f5d;
	}

	.x-tick-label {
		text-anchor: middle;
	}

	.y-tick-label {
		text-anchor: end;
	}

	button {
		cursor: pointer;
	}
</style>
