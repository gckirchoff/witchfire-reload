interface FrostbiteParams {
	maxDuration?: number;
	wellTimedFraction?: number;
}

export class Frostbite {
	progress = $state(0);
	reloadingInterval = $state(0);

	maxDuration = 1000;
	wellTimedWindow = 0.2;

	constructor({ maxDuration = 1000, wellTimedFraction = 0.2 }: FrostbiteParams = {}) {
		this.maxDuration = maxDuration;
		this.wellTimedWindow = wellTimedFraction;
	}

	startReload = () => {
		this.reloadingInterval = setInterval(() => {
			if (this.progress >= this.maxDuration) {
				this.reset();
				return;
			}
			this.progress++;
		}, 1);
	};

	timedPress = () => {
		if (!this.reloadingInterval) {
			return;
		}
		const percentThrough = this.progress / this.maxDuration;
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
		clearInterval(this.reloadingInterval);
		this.progress = 0;
	};
}
