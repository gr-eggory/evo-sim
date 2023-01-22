<script lang="ts">
	import type { Row } from '../../types/data';
	import {
		generateChildren,
		randomAlphaString,
		similarity,
		findBestChild,
		prettifyPercent,
	} from '../../util';

	export let identifier: string;
	export let runSimulation: boolean;
	export let optimal: string;
	export let mutationRate: number;
	export let offspring: number;
	export let addRow: (row: Row) => void;

	let interval: NodeJS.Timer;
	let generation = 1;
	let simulationFinished = false;

	$: closestIndividual = randomAlphaString(optimal.length);
	$: currentSimilarity = similarity(closestIndividual, optimal);
	$: children = generateChildren(closestIndividual, mutationRate, offspring);

	const beginSimulation = () => {
		interval = setInterval(() => {
			const newBest = findBestChild(children, optimal);
			closestIndividual = newBest.text;
			currentSimilarity = newBest.closeenessToOptimal;
			children = generateChildren(closestIndividual, mutationRate, offspring);
			addRow({ identifier, generation, similarity: currentSimilarity * 100 });
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
		border-bottom: 1px solid rgba(38, 30, 30, .5);
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
