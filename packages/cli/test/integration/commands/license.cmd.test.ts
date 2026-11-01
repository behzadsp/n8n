import { mockInstance } from '@n8n/backend-test-utils';
import { LICENSE_FEATURES } from '@n8n/constants';
import { Container } from '@n8n/di';

import { ClearLicenseCommand } from '@/commands/license/clear';
import { License } from '@/license';
import { LoadNodesAndCredentials } from '@/load-nodes-and-credentials';
import { setupTestCommand } from '@test-integration/utils/test-command';

mockInstance(LoadNodesAndCredentials);
const command = setupTestCommand(ClearLicenseCommand);

test('license:clear completes without changing local features', async () => {
	const license = Container.get(License);
	const initSpy = vi.spyOn(license, 'init');
	const clearSpy = vi.spyOn(license, 'clear');
	const saveCertStrSpy = vi.spyOn(license, 'saveCertStr');
	const sharingBefore = license.isLicensed(LICENSE_FEATURES.SHARING);

	await command.run();

	expect(initSpy).toHaveBeenCalledTimes(1);
	expect(clearSpy).toHaveBeenCalledTimes(1);
	expect(saveCertStrSpy).not.toHaveBeenCalled();
	expect(await license.loadCertStr()).toBe('');
	expect(license.isLicensed(LICENSE_FEATURES.SHARING)).toBe(sharingBefore);
});
