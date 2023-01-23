<script lang="ts">
	import type { Row } from '../../types/data';
	import { State } from '../../types/data';
	import {
		generateChildren,
		randomAlphaString,
		similarity,
		findBestChild,
		prettifyPercent,
	} from '../../util';

	export let id: number;
	export let runSimulation: boolean;
	export let allSimsFinished: boolean;
	export let optimal: string;
	export let mutationRate: number;
	export let offspring: number;
	export let addRow: (row: Row) => void;
	export let dispatchState: (id: number, ended: State) => void;

	let interval: NodeJS.Timer;
	let generation = 1;
	let simulationFinished = false;
	let resetOnNextPlay = false;
	let isFirstRender = true;

	$: closestIndividual = randomAlphaString(optimal.length);
	$: currentSimilarity = similarity(closestIndividual, optimal);
	$: children = generateChildren(closestIndividual, mutationRate, offspring);

	$: {
		if (isFirstRender) {
			isFirstRender = false;
		} else if (allSimsFinished) {
			resetOnNextPlay = true;
		}
	}

	const reset = () => {
		generation = 1;
		closestIndividual = randomAlphaString(optimal.length);
		currentSimilarity = similarity(closestIndividual, optimal);
		children = generateChildren(closestIndividual, mutationRate, offspring);
		resetOnNextPlay = false;
		simulationFinished = false;
	};

	const beginSimulation = () => {
		if (simulationFinished && !resetOnNextPlay) {
			return;
		}
		if (simulationFinished && resetOnNextPlay) {
			reset();
		}
		interval = setInterval(() => {
			if (closestIndividual === optimal) {
				clearInterval(interval);
				dispatchState(id, State.I_HAVE_FINISHED);
				simulationFinished = true;
				return;
			}
			const newBest = findBestChild(children, optimal);
			closestIndividual = newBest.text;
			currentSimilarity = newBest.closeenessToOptimal;
			children = generateChildren(closestIndividual, mutationRate, offspring);
			addRow({ id, generation, similarity: currentSimilarity * 100 });
			generation++;
		}, 10);
	};

	$: runSimulation ? beginSimulation() : clearInterval(interval);
</script>

<div class="simulation-configs-list">
	<h3 class="optimal__label">Optimal:</h3>
	<h2 class="optimal__value">{optimal}</h2>
	<h3 class="success__label">Current phenotype:</h3>
	<h2 class="success__value">{closestIndividual}</h2>
	<h4>Similarity: {prettifyPercent(currentSimilarity)}</h4>
	<h3 class="generation">Generation: {generation}</h3>
</div>

<style>
	.simulation-configs-list {
		flex: 0 0 800px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		align-content: flex-start;
		border-bottom: 1px solid rgba(38, 30, 30, 0.5);
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
</style>
