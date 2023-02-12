<script lang="ts">
	import type { ScaleLinear } from 'd3';

	type T = $$Generic;
	export let data: T[];
	export let xValue: (d: T) => number;
	export let yValue: (d: T) => number;
	export let tooltip: (d: T) => string;
	export let xScale: ScaleLinear<number, number, never>;
	export let yScale: ScaleLinear<number, number, never>;
</script>

{#each data as d (xValue(d))}
	<circle
		cx={xScale(xValue(d))}
		cy={yScale(yValue(d))}
		r={7}
		fill="transparent"
	>
		<title>{tooltip(d)}</title>
	</circle>
{/each}
