import { LicenseState } from '@n8n/backend-common';
import { LICENSE_FEATURES, LICENSE_QUOTAS, UNLIMITED_LICENSE_QUOTA } from '@n8n/constants';
import nock from 'nock';

import { License } from '@/license';

// Fail if the local provider loads the network SDK.
vi.mock('@n8n_io/license-sdk', () => {
	throw new Error('The local license provider must not load the license SDK');
});

describe('Local license', () => {
	const license = new License();

	beforeAll(() => nock.disableNetConnect());
	afterAll(() => nock.enableNetConnect());

	test('keeps local features available through all lifecycle calls', async () => {
		const state = new LicenseState();
		state.setLicenseProvider(license);

		await license.init();
		await license.init({ forceRecreate: true, isCli: true });
		await license.activate('unused-key');
		await license.renewIfDue();
		await license.renew();
		await license.reload();
		await license.clear();
		await license.shutdown();

		expect(state.isSharingLicensed()).toBe(true);
		expect(state.isSamlLicensed()).toBe(true);
		expect(state.isMultiMainLicensed()).toBe(true);
		expect(state.getMaxTeamProjects()).toBe(UNLIMITED_LICENSE_QUOTA);
		expect(state.getMaxWorkflowsWithEvaluations()).toBe(UNLIMITED_LICENSE_QUOTA);
		expect(license.getPlanName()).toBe('Enterprise');
	});

	test('keeps the API enabled and hosted billing disabled', () => {
		expect(license.isLicensed(LICENSE_FEATURES.API_DISABLED)).toBe(false);
		expect(license.getValue(LICENSE_FEATURES.API_DISABLED)).toBe(false);
		expect(license.isLicensed(LICENSE_FEATURES.SHOW_NON_PROD_BANNER)).toBe(false);
		expect(license.isLicensed(LICENSE_FEATURES.AI_GATEWAY_CLOUD_UBB)).toBe(false);
		expect(license.isLicensed(LICENSE_FEATURES.AI_ASSISTANT_CLOUD_UBB_ENTITLEMENT)).toBe(false);
		expect(license.getValue(LICENSE_QUOTAS.AI_GATEWAY_BUDGET)).toBeUndefined();
	});

	test('does not expose or create remote credentials', async () => {
		const onRefresh = vi.fn();
		const unsubscribe = license.onCertRefresh(onRefresh);
		await license.saveCertStr('unused-certificate');
		await license.reload();

		expect(await license.loadCertStr()).toBe('');
		expect(license.getManagementJwt()).toBe('');
		expect(license.getCurrentEntitlements()).toEqual([]);
		expect(license.getMainPlan()).toBeUndefined();
		expect(license.isCertValid()).toBe(false);
		expect(license.hasFeatureInCert(LICENSE_FEATURES.SHARING)).toBe(false);
		expect(onRefresh).not.toHaveBeenCalled();
		unsubscribe();
	});

	test('has no expiry and describes local operation', () => {
		expect(license.getExpiryDate()).toBeNull();
		expect(license.getTerminationDate()).toBeNull();
		expect(license.getExpiringInDays()).toBeUndefined();
		expect(license.getTerminatingInDays()).toBeUndefined();
		expect(license.getInfo()).toContain('No license server is used');
	});
});
