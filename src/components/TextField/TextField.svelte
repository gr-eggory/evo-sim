<script lang="ts">
	type T = $$Generic<'text' | 'number'>;
	export let type: T;
	export let value: T extends 'text' ? string : number;
	export let label: string;
	export let id: string;

	export let step = '0.001';
</script>

{#if type === 'number'}
	<label for={id}>{label}</label>
	<input bind:value type="number" {id} {step} />
{:else}
	<label for={id}>{label}</label>
	<input bind:value type="string" {id} />
{/if}
