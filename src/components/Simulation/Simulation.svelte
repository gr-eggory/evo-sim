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
	import Button from '../Button/Button.svelte';

	export let id: number;
	export let runSimulation: boolean;
	export let allSimsFinished: boolean;
	export let optimal: string;
	export let mutationRate: number;
	export let offspring: number;
	export let textColor: string;
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

<div class="phenotypes-container">
	<p>{optimal}</p>
	<p style={`color: ${textColor};`}>
		{closestIndividual}
	</p>
</div>
<p>{mutationRate}</p>
<p>{offspring}</p>
<p>{generation}</p>
<p>{prettifyPercent(currentSimilarity)}</p>
<Button content="X" disabled={runSimulation} />

<style>
	.phenotypes-container::before {
		content: '';
		position: absolute;
		background-color: rgba(128, 128, 128, 0.5);
		height: 1px;
		width: 100%;
		translate: -12px -7px;
	}
</style>
