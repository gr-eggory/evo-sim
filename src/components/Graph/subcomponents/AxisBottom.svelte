<script lang="ts">
	import type { ScaleLinear } from 'd3';

	export let innerWidth: number;
	export let innerHeight: number;
	export let xAxisLabelOffset: number;
	export let xAxisLabel: string;
	export let xScale: ScaleLinear<number, number, never>;
</script>

<text class="axis-label" x={innerWidth / 2} y={innerHeight + xAxisLabelOffset}>
	{xAxisLabel}
</text>
{#each xScale.ticks() as tickValue (tickValue)}
	<g class="tick" transform={`translate(${xScale(tickValue)},0)`}>
		<line y2={innerHeight} />
		<text dy=".71em" y={innerHeight + 7}>
			{tickValue}
		</text>
	</g>
{/each}

<style>
	.tick line {
		stroke: #c0c0bb;
	}

	.tick text {
		fill: #635f5d;
		text-anchor: middle;
	}
</style>
