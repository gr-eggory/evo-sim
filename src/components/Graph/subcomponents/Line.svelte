<script lang="ts">
	export let stroke: string;
	export let linePath: string;
</script>

<g class="marks">
	<path fill="none" {stroke} d={linePath} />
</g>
