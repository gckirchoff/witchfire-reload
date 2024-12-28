interface FrostbiteParams {
	maxDuration?: number;
	wellTimedFraction?: number;
	startingPerfectTimedWindow?: number;
}

type State = 'idle' | 'reloading' | 'well-timed' | 'perfect';

export class Frostbite {
	state = $state<State>('idle');
	mysterium = $state(2);
	streak = $state(0);
	perfectWindow = $state(0);
	showBar = $state(false);
	disabled = $state(false);
	private animationFrame = $state(0);
	private startTime = $state(0);
	private elapsedTime = $state(0);

	wellTimedWindow: number;
	private startingPerfectTimedWindow: number;
	private maxDuration: number;

	constructor({
		maxDuration = 1000,
		wellTimedFraction = 0.2,
		startingPerfectTimedWindow = 0.1
	}: FrostbiteParams = {}) {
		this.maxDuration = maxDuration;
		this.wellTimedWindow = wellTimedFraction;
		this.startingPerfectTimedWindow = startingPerfectTimedWindow;
		this.perfectWindow = startingPerfectTimedWindow;
	}

	get progress() {
		return this.elapsedTime / this.maxDuration;
	}

	handleReload = () => {
		if (this.disabled) {
			return;
		}
		if (this.state === 'idle') {
			this.startReload();
		} else {
			this.timedPress();
		}
	};

	private startReload = () => {
		this.state = 'reloading';
		this.showBar = true;
		const loop = (t: number) => {
			if (this.state === 'reloading' && this.startTime === 0) {
				this.startTime = t;
			}
			this.elapsedTime = t - this.startTime;
			if (this.elapsedTime > this.maxDuration) {
				this.reset();
				return;
			}
			requestAnimationFrame(loop);
		};
		this.animationFrame = requestAnimationFrame(loop);
	};

	private timedPress = () => {
		if (!this.animationFrame) {
			return;
		}
		const bounds = this.calculateBounds();
		const isPerfectlyTimed =
			this.mysterium === 2 &&
			this.progress > bounds.lowerPerfectlyTimed &&
			this.progress < bounds.lowerWellTimed;

		const isWellTimed =
			this.progress > bounds.lowerWellTimed && this.progress < bounds.upperWellTimed;

		const result = isPerfectlyTimed ? 'PERFECT' : isWellTimed ? 'GOOD' : 'BAD';

		this.adjustPerfectWindow(result);

		this.reset();
	};

	private calculateBounds = () => ({
		lowerWellTimed: 0.5 - this.wellTimedWindow / 2,
		upperWellTimed: 0.5 + this.wellTimedWindow / 2,
		lowerPerfectlyTimed: 0.5 - this.wellTimedWindow / 2 - this.perfectWindow
	});

	private adjustPerfectWindow = (result: string) => {
		if (result === 'PERFECT') {
			this.perfectWindow *= 0.7;
		} else {
			this.perfectWindow = this.startingPerfectTimedWindow;
		}
	};

	private reset = () => {
		cancelAnimationFrame(this.animationFrame);
		this.state = 'idle';
		this.animationFrame = 0;
		this.startTime = 0;
		this.elapsedTime = 0;
		this.disabled = true;
		setTimeout(() => {
			this.showBar = false;
			this.disabled = false;
		}, 1000);
	};
}
