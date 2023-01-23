import { alphabet } from '../constants';
import { State } from '../types/data';

export const randomAlphaString = (
	length: number,
	includeSpaces = true
): string => {
	let builtString = '';
	for (let i = 0; i < length; i++) {
		builtString +=
			alphabet[
				Math.floor(
					Math.random() *
						(includeSpaces ? alphabet.length : alphabet.length - 1)
				)
			];
	}
	return builtString;
};

export const similarity = (a: string, b: string): number => {
	const aIsSmaller = a.length - b.length;
	const smallerLength = aIsSmaller ? a.length : b.length;
	const largerLength = aIsSmaller ? b.length : a.length;
	let equivalencies = 0;
	for (let i = 0; i < smallerLength; i++) {
		if (a[i] === b[i]) {
			equivalencies++;
		}
	}
	return equivalencies / largerLength;
};

export class Child {
	text: string;
	closeenessToOptimal: number;
	constructor(text: string, closeenessToOptimal: number) {
		this.text = text;
		this.closeenessToOptimal = closeenessToOptimal;
	}
}

export const findBestChild = (children: string[], optimal: string) => {
	let bestChild = new Child(children[0], similarity(children[0], optimal));
	for (let i = 1; i < children.length; i++) {
		const currentChild = children[i];
		const closenessToOpt = similarity(currentChild, optimal);
		if (closenessToOpt > bestChild.closeenessToOptimal) {
			bestChild = new Child(currentChild, closenessToOpt);
		}
	}
	return bestChild;
};

export const generateChildren = (
	closestIndividual: string,
	mutationRate: number,
	amountOfChildren = 6
): string[] => {
	const children: string[] = [];
	for (let i = 0; i < amountOfChildren; i++) {
		const newChild = closestIndividual.split('').reduce((acc, letter) => {
			const shouldMutate = Math.random() < mutationRate;
			acc += shouldMutate ? randomAlphaString(1) : letter;
			return acc;
		}, '');
		children.push(newChild);
	}
	return children;
};

export const prettifyPercent = (percent: number): string =>
	`${(percent * 100).toString().substring(0, 4)}%`;

export const allSimsReady = (numOfSims: number): State[] =>
	new Array(numOfSims).fill(State.READY_TO_RUN);
