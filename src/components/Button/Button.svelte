<script lang="ts">
	export let content: string;

	export let type: string = 'button';
	export let disabled = false;
</script>

{#if type === 'submit'}
	<button on:click {disabled} type="submit">{content}</button>
{:else}
	<button on:click {disabled}>{content}</button>
{/if}

<style>
	button {
        cursor: pointer;
	}
</style>
