<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	{@render children()}
</div>

<style>
	.app {
		min-height: 100vh;
		background-color: #1b1f20;
	}
</style>
