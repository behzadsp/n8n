import { testDb } from '@n8n/backend-test-utils';
import { LICENSE_FEATURES } from '@n8n/constants';
import { SettingsRepository } from '@n8n/db';
import { Container } from '@n8n/di';

import { SETTINGS_LICENSE_CERT_KEY } from '@/constants';
import { License } from '@/license';
import { LicenseRenewalTask } from '@/license/license-renewal.task';

vi.mock('@n8n_io/license-sdk', () => {
	throw new Error('Local license tasks must not load the license SDK');
});

describe('local license across two mains', () => {
	beforeAll(async () => await testDb.init());
	afterAll(async () => await testDb.terminate());

	it('ignores a stored certificate and keeps local features available on both mains', async () => {
		const settings = Container.get(SettingsRepository);
		await settings.upsert(
			{ key: SETTINGS_LICENSE_CERT_KEY, value: 'existing-certificate', loadOnStartup: false },
			['key'],
		);

		try {
			const mains = [new License(), new License()];
			for (const license of mains) {
				await license.init();
				await new LicenseRenewalTask(license).run();
				await license.reload();
				await license.shutdown();
				expect(license.isLicensed(LICENSE_FEATURES.MULTIPLE_MAIN_INSTANCES)).toBe(true);
				expect(await license.loadCertStr()).toBe('');
			}

			const stored = await settings.findOneByOrFail({ key: SETTINGS_LICENSE_CERT_KEY });
			expect(stored.value).toBe('existing-certificate');
		} finally {
			await settings.delete({ key: SETTINGS_LICENSE_CERT_KEY });
		}
	});
});
