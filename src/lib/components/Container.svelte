<script lang="ts">
	let { children } = $props();
</script>

<div>
	{@render children?.()}
</div>

<style>
	div {
		border: 1px solid var(--color);
		padding: 0.5rem;
		border-radius: 0.25rem;
	}
</style>
