<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

Color:
<select>
	{#each data.colors as m (m.id)}
		<option id={m.id.toString()}>{m.name}</option>
	{/each}
</select>
