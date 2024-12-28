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
	{#if frostbite.showBar}
		<div
			class="bar"
			class:missed={frostbite.reloadResult === 'missed'}
			transition:fade={{ duration: 90 }}
		>
			{#if frostbite.mysterium === 2}
				<div
					class="perfect-timed-window"
					class:perfectly-timed={frostbite.reloadResult === 'perfect'}
					style="--well-timed-window: {frostbite.wellTimedWindow *
						100}%; --perfect-timed-window: {frostbite.perfectWindow * 100}%;"
				></div>
			{/if}
			<div
				class="well-timed-window"
				class:well-timed={frostbite.reloadResult === 'well-timed'}
				style="--well-timed-window: {frostbite.wellTimedWindow * 100}%"
			></div>
			{#if !frostbite.disabled}
				<div class="slider" style="--left: {frostbite.progress * 100}%"></div>
			{/if}
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
		background-color: brown;
		width: min(70rem, 90%);
		height: 2rem;
		position: relative;
	}

	.missed {
		animation: horizontal-shake 300ms;
	}

	.well-timed-window {
		width: var(--well-timed-window);
		height: 2rem;
		background-color: rgb(0, 0, 255);
		position: absolute;
		top: 0;
		left: calc(50% - var(--well-timed-window) * 0.5);
		transition: box-shadow ease-in-out 200ms;
	}

	.perfect-timed-window {
		height: 2rem;
		background-color: aqua;
		border-right: 1px solid green;
		position: absolute;
		top: 0;
		width: var(--perfect-timed-window);
		left: calc(50% - (var(--well-timed-window) * 0.5) - var(--perfect-timed-window));
		transition: box-shadow ease-in-out 200ms;
	}

	.well-timed {
		box-shadow:
			0px 20px 5px rgba(42, 42, 242, 0.6),
			0px -20px 5px rgba(42, 42, 242, 0.6);
	}

	.perfectly-timed {
		box-shadow:
			0px 20px 5px rgba(0, 255, 255, 0.5),
			0px -20px 5px rgba(0, 255, 255, 0.5);
	}

	.slider {
		height: 100%;
		width: 0.5rem;
		background-color: white;
		position: absolute;
		top: 0;
		left: var(--left);
	}

	@keyframes horizontal-shake {
		0% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(5px);
		}
		50% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(5px);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
