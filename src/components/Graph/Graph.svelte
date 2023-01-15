<script lang="ts">
	import { scaleLinear, extent, line, curveNatural, max } from 'd3';

	import AxisBottom from './subcomponents/AxisBottom.svelte';
	import AxisLeft from './subcomponents/AxisLeft.svelte';
	import Line from './subcomponents/Line.svelte';
	import type { Margin } from '../../types/layout';

	export let width: number;
	export let height: number;
	export let margin: Margin;
	export let xAxisLabelOffset: number;
	export let yAxisLabelOffset: number;
	export let xAxisLabel: string;
	export let yAxisLabel: string;

	type T = $$Generic;
	export let data: T[];
	export let xValue: (d: T) => number;
	export let yValue: (d: T) => number;

	$: innerHeight = height - margin.top - margin.bottom;
	$: innerWidth = width - margin.left - margin.right;

	$: xScale = scaleLinear()
		.domain(extent(data, xValue))
		.range([0, innerWidth])
		.nice();
	$: yScale = scaleLinear()
		.domain([0, max(data, yValue)])
		.range([innerHeight, 0])
		.nice();

	$: linePath = line<T>()
		.x((d) => xScale(xValue(d)))
		.y((d) => yScale(yValue(d)))
		.curve(curveNatural)(data);
</script>

<div class="graph-container">
	<svg {width} {height}>
		<g transform={`translate(${margin.left},${margin.top})`}>
			<AxisBottom
				{xAxisLabelOffset}
				{xAxisLabel}
				{xScale}
				{innerWidth}
				{innerHeight}
			/>
			<AxisLeft
				{yAxisLabelOffset}
				{yAxisLabel}
				{yScale}
				{innerWidth}
				{innerHeight}
			/>
			<!-- MARKS -->
			<Line {linePath} />
		</g>
	</svg>
</div>

<style>
	.graph-container {
		background-color: #efecea;
		flex: 0 0 800px;
		height: 500px;
	}
</style>
