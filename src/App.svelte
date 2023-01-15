<script lang="ts">
	import { onMount, onDestroy, afterUpdate } from 'svelte';
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
	let offspring = 15;
	let generation = 0;

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
		}
	};

	const beginSimulation = () => {
		interval = setInterval(() => {
			const newBest = findBestChild(children, optimal);
			closestIndividual = newBest.text;
			currentSimilarity = newBest.closeenessToOptimal;
			children = generateChildren(closestIndividual, mutationRate, offspring);
			if (closestIndividual === optimal) {
				clearInterval(interval);
				simulationFinished = true;
				runSimulation = false;
			}
			generation++;
		}, 10);
	};

	$: runSimulation ? beginSimulation() : clearInterval(interval);
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
		background-color: rgba(255, 0, 0, .2);
		flex: 0 0 800px;
		height: 800px;
	}

	button {
		cursor: pointer;
	}
</style>
