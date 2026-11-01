import { Time } from '@n8n/constants';
import { clusterTarget, intervalFromMilliseconds, SystemTask } from '@n8n/decorators';
import type { SystemTaskSchedule } from '@n8n/decorators';

import { License } from '@/license';

/** Retains the task interface for existing scheduler callers. Local renewal does nothing. */
@SystemTask()
export class LicenseRenewalTask implements SystemTask {
	readonly name = 'license-renewal';

	readonly schedule: SystemTaskSchedule = intervalFromMilliseconds(
		15 * Time.minutes.toMilliseconds,
	);

	readonly target = clusterTarget({
		scheduler: {
			/** A retry after a failed renewal resends a token the server may have rotated already. */
			retryOnFailure: false,
			/** Kept well under one interval, so two checks are never claimable at once. */
			missedAfterSeconds: 5 * Time.minutes.toSeconds,
			/** A check that missed its grace window still runs once, late. */
			catchUp: true,
		},
		leaderTimer: {
			/** A new leader may inherit a due renewal whose window closes before the next interval. */
			runOnTakeover: true,
		},
	});

	constructor(private readonly license: License) {}

	async run(): Promise<void> {
		await this.license.renewIfDue();
	}
}
