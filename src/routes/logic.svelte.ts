interface FrostbiteParams {
	maxDuration?: number;
	wellTimedFraction?: number;
}

export class Frostbite {
	private animationFrame = $state(0);
	private startTime = $state(0);
	private elapsedTime = $state(0);

	private maxDuration;
	private wellTimedWindow;

	constructor({ maxDuration = 1000, wellTimedFraction = 0.2 }: FrostbiteParams = {}) {
		this.maxDuration = maxDuration;
		this.wellTimedWindow = wellTimedFraction;
	}

	get isReloading() {
		return !!this.animationFrame;
	}

	get progress() {
		return this.elapsedTime / this.maxDuration;
	}

	handleReload = () => {
		if (!this.isReloading) {
			this.startReload();
		} else {
			this.timedPress();
		}
	};

	private startReload = () => {
		const loop = (t: number) => {
			if (this.startTime === 0) {
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
		const percentThrough = this.elapsedTime / this.maxDuration;
		const bounds = this.calculateBounds();

		const isWellTimed =
			percentThrough > bounds.lowerWellTimed && percentThrough < bounds.upperWellTimed;

		console.log(isWellTimed ? 'HOORAY' : 'bad');
		this.reset();
	};

	private calculateBounds = () => ({
		lowerWellTimed: 0.5 - this.wellTimedWindow / 2,
		upperWellTimed: 0.5 + this.wellTimedWindow / 2
	});

	private reset = () => {
		cancelAnimationFrame(this.animationFrame);
		this.animationFrame = 0;
		this.startTime = 0;
		this.elapsedTime = 0;
	};
}
