<script lang="ts">
	import { scaleLinear, extent, line, curveNatural, max } from 'd3';

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

<svg {width} {height}>
	<g transform={`translate(${margin.left},${margin.top})`}>
		<!-- AXIS BOTTOM -->
		<text
			class="axis-label"
			x={innerWidth / 2}
			y={innerHeight + xAxisLabelOffset}
		>
			{xAxisLabel}
		</text>
		{#each xScale.ticks() as tickValue (tickValue)}
			<g class="tick" transform={`translate(${xScale(tickValue)},0)`}>
				<line y2={innerHeight} />
				<text class="tick-label x-tick-label" dy=".71em" y={innerHeight + 7}>
					{tickValue}
				</text>
			</g>
		{/each}
		<!-- AXIS LEFT -->
		<text
			class="axis-label"
			style="text-anchor: middle"
			transform={`translate(${-yAxisLabelOffset},${
				innerHeight / 2
			}) rotate(-90)`}
		>
			{yAxisLabel}
		</text>
		{#each yScale.ticks() as tickValue (tickValue)}
			<g class="tick" transform={`translate(0,${yScale(tickValue)})`}>
				<line x2={innerWidth} />
				<text class="tick-label y-tick-label" x={-3} dy=".32em">
					{tickValue}
				</text>
			</g>
		{/each}
		<!-- MARKS -->
		<g class="marks">
			<path fill="none" stroke="#137B80" d={linePath} />
		</g>
	</g>
</svg>
