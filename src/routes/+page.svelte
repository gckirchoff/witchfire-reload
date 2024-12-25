<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Frostbite } from './logic.svelte';

	const frostbite = new Frostbite();

	const handleKeyDown = (
		event: KeyboardEvent & {
			currentTarget: EventTarget & Document;
		}
	) => {
		if (event.key.toLowerCase() !== 'r') {
			return;
		}
		frostbite.handleReload();
	};
</script>

<svelte:document on:touchstart={frostbite.handleReload} on:keydown={handleKeyDown} />

<main>
	<div class="headers">
		<h1>Frostbite Reload</h1>
		<h3>Press R to reload</h3>
	</div>
	{#if frostbite.state === 'reloading'}
		<div class="bar" transition:fade={{ duration: 90 }}>
			<div
				class="well-timed-window"
				style="--well-timed-window: {frostbite.wellTimedWindow * 100}%"
			></div>
			<div class="slider" style="--left: {frostbite.progress * 100}%"></div>
		</div>
	{/if}
</main>

<style>
	main {
		min-height: inherit;
		padding-top: 35vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5rem;
		text-align: center;
	}

	h1 {
		font-size: 5rem;
	}

	h3 {
		font-size: 3rem;
	}

	.bar {
		background-color: blue;
		width: min(70rem, 90%);
		height: 2rem;
		position: relative;
	}

	.well-timed-window {
		width: var(--well-timed-window);
		height: 2rem;
		background-color: cyan;
		position: absolute;
		top: 0;
		left: calc(50% - var(--well-timed-window) * 0.5);
	}

	.slider {
		height: 100%;
		width: 0.5rem;
		background-color: white;
		position: absolute;
		top: 0;
		left: var(--left);
	}
</style>
