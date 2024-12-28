interface FrostbiteParams {
	maxDuration?: number;
	wellTimedFraction?: number;
	perfectWindow?: number;
}

type State = 'idle' | 'reloading';

export class Frostbite {
	state = $state<State>('idle');
	mysterium = $state(2);
	streak = $state(0);
	private animationFrame = $state(0);
	private startTime = $state(0);
	private elapsedTime = $state(0);
	
	perfectWindow: number;
	wellTimedWindow: number;
	private maxDuration: number;

	constructor({
		maxDuration = 1000,
		wellTimedFraction = 0.2,
		perfectWindow = 0.1
	}: FrostbiteParams = {}) {
		this.maxDuration = maxDuration;
		this.wellTimedWindow = wellTimedFraction;
		this.perfectWindow = perfectWindow;
	}

	get progress() {
		return this.elapsedTime / this.maxDuration;
	}

	handleReload = () => {
		if (this.state === 'idle') {
			this.startReload();
		} else {
			this.timedPress();
		}
	};

	private startReload = () => {
		this.reset();
		this.state = 'reloading';
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
		console.log(result);
		this.reset();
	};

	private calculateBounds = () => ({
		lowerWellTimed: 0.5 - this.wellTimedWindow / 2,
		upperWellTimed: 0.5 + this.wellTimedWindow / 2,
		lowerPerfectlyTimed: 0.5 - this.wellTimedWindow / 2 - this.perfectWindow
	});

	private reset = () => {
		cancelAnimationFrame(this.animationFrame);
		this.state = 'idle';
		this.animationFrame = 0;
		this.startTime = 0;
		this.elapsedTime = 0;
	};
}
