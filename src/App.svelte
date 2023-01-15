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
	<div class="output-grid">
		<h3 class="optimal__label">Optimal:</h3>
		<h2 class="optimal__value">{optimal}</h2>
		<h3 class="success__label">Current phenotype:</h3>
		<h2 class="success__value">{closestIndividual}</h2>
		<h4>Similarity: {prettifyPercent(currentSimilarity)}</h4>
		<h3 class="generation">Generation: {generation}</h3>
	</div>
	<form on:submit={assignOptimal}>
		<input type="text" bind:value={input} />
	</form>
	<button on:click={toggleSimulation}
		>{runSimulation && !simulationFinished ? 'Stop' : 'Begin'} Simulation</button
	>
</main>

<style>
	main {
		min-height: 100vh;
		background-color: whitesmoke;
		padding-top: 5rem;
	}

	.output-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		width: 95%;
		margin: 0 auto;
		gap: 1rem;
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

	button {
		cursor: pointer;
	}
</style>
