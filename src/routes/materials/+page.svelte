<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

Material:
<select>
	<optgroup>
		{#each data.materials as m (m.id)}
			<option id={m.id.toString()}>{m.name}</option>
		{/each}
	</optgroup>
</select>
