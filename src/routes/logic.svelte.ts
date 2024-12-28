interface FrostbiteParams {
	maxDuration?: number;
	wellTimedFraction?: number;
	startingPerfectTimedWindow?: number;
}

type State = 'idle' | 'reloading';

type ReloadResult = null | 'perfect' | 'well-timed';

export class Frostbite {
	state = $state<State>('idle');
	reloadResult = $state<ReloadResult>(null);
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

		this.reloadResult = isPerfectlyTimed ? 'perfect' : isWellTimed ? 'well-timed' : null;
		this.adjustPerfectWindow();
		this.reset();
	};

	private calculateBounds = () => ({
		lowerWellTimed: 0.5 - this.wellTimedWindow / 2,
		upperWellTimed: 0.5 + this.wellTimedWindow / 2,
		lowerPerfectlyTimed: 0.5 - this.wellTimedWindow / 2 - this.perfectWindow
	});

	private adjustPerfectWindow = () => {
		if (this.reloadResult === 'perfect') {
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
			this.reloadResult = null;
		}, 1000);
	};
}
