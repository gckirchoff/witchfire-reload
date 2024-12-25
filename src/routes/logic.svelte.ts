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
				clearInterval(this.reloadingInterval);
				this.progress = 0;
				return;
			}
			this.progress++;
		}, 1);
	};

	timedPress = () => {
		if (!this.reloadingInterval) {
			return;
		}
	};
}
