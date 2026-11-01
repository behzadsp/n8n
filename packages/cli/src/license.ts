import type { LicenseProvider } from '@n8n/backend-common';
import {
	DEFAULT_WORKFLOW_HISTORY_PRUNE_LIMIT,
	LICENSE_FEATURES,
	LICENSE_QUOTAS,
	UNLIMITED_LICENSE_QUOTA,
	type BooleanLicenseFeature,
	type NumericLicenseFeature,
} from '@n8n/constants';
import { OnPubSubEvent, OnShutdown } from '@n8n/decorators';
import { Service } from '@n8n/di';
import type { TEntitlement, TLicenseBlock } from '@n8n_io/license-sdk';

import { localLicenseFeatures } from './license/local-features';

export type FeatureReturnType = Partial<
	{
		planName: string;
	} & { [K in NumericLicenseFeature]: number } & { [K in BooleanLicenseFeature]: boolean }
>;

type LicenseRefreshCallback = (cert: string) => void;

/** Provides local features without a license server or certificate. */
@Service()
export class License implements LicenseProvider {
	// Keep lifecycle methods for callers that also support certificate-based distributions.
	async init(_options: { forceRecreate?: boolean; isCli?: boolean } = {}): Promise<void> {}

	async loadCertStr(): Promise<TLicenseBlock> {
		return '';
	}

	async saveCertStr(_value: TLicenseBlock): Promise<void> {}

	// Local features never expire, so there are no certificate refresh events.
	onCertRefresh(_refreshCallback: LicenseRefreshCallback): () => void {
		return () => {};
	}

	async activate(_activationKey: string, _eulaUri?: string, _userEmail?: string): Promise<void> {}

	@OnPubSubEvent('reload-license')
	async reload(): Promise<void> {}

	async renewIfDue(): Promise<void> {}

	async renew(): Promise<void> {}

	async clear(): Promise<void> {}

	@OnShutdown()
	async shutdown(): Promise<void> {}

	isLicensed(feature: BooleanLicenseFeature) {
		return localLicenseFeatures[feature] ?? false;
	}

	isCertValid(): boolean {
		return false;
	}

	hasFeatureInCert(_feature: BooleanLicenseFeature): boolean {
		return false;
	}

	/** @deprecated Use `LicenseState.isDynamicCredentialsLicensed` instead. */
	isDynamicCredentialsEnabled() {
		return this.isLicensed(LICENSE_FEATURES.DYNAMIC_CREDENTIALS);
	}

	/** @deprecated Use `LicenseState.isSharingLicensed` instead. */
	isSharingEnabled() {
		return this.isLicensed(LICENSE_FEATURES.SHARING);
	}

	/** @deprecated Use `LicenseState.isLogStreamingLicensed` instead. */
	isLogStreamingEnabled() {
		return this.isLicensed(LICENSE_FEATURES.LOG_STREAMING);
	}

	/** @deprecated Use `LicenseState.isLdapLicensed` instead. */
	isLdapEnabled() {
		return this.isLicensed(LICENSE_FEATURES.LDAP);
	}

	/** @deprecated Use `LicenseState.isSamlLicensed` instead. */
	isSamlEnabled() {
		return this.isLicensed(LICENSE_FEATURES.SAML);
	}

	/** @deprecated Use `LicenseState.isAiAssistantLicensed` instead. */
	isAiAssistantEnabled() {
		return this.isLicensed(LICENSE_FEATURES.AI_ASSISTANT);
	}

	/** @deprecated Use `LicenseState.isAskAiLicensed` instead. */
	isAskAiEnabled() {
		return this.isLicensed(LICENSE_FEATURES.ASK_AI);
	}

	/** @deprecated Use `LicenseState.isAiCreditsLicensed` instead. */
	isAiCreditsEnabled() {
		return this.isLicensed(LICENSE_FEATURES.AI_CREDITS);
	}

	/** @deprecated Use `LicenseState.isAdvancedExecutionFiltersLicensed` instead. */
	isAdvancedExecutionFiltersEnabled() {
		return this.isLicensed(LICENSE_FEATURES.ADVANCED_EXECUTION_FILTERS);
	}

	/** @deprecated Use `LicenseState.isAdvancedPermissionsLicensed` instead. */
	isAdvancedPermissionsLicensed() {
		return this.isLicensed(LICENSE_FEATURES.ADVANCED_PERMISSIONS);
	}

	/** @deprecated Use `LicenseState.isDebugInEditorLicensed` instead. */
	isDebugInEditorLicensed() {
		return this.isLicensed(LICENSE_FEATURES.DEBUG_IN_EDITOR);
	}

	/** @deprecated Use `LicenseState.isBinaryDataS3Licensed` instead. */
	isBinaryDataS3Licensed() {
		return this.isLicensed(LICENSE_FEATURES.BINARY_DATA_S3);
	}

	/** @deprecated Use `LicenseState.isMultiMainLicensed` instead. */
	isMultiMainLicensed() {
		return this.isLicensed(LICENSE_FEATURES.MULTIPLE_MAIN_INSTANCES);
	}

	/** @deprecated Use `LicenseState.isVariablesLicensed` instead. */
	isVariablesEnabled() {
		return this.isLicensed(LICENSE_FEATURES.VARIABLES);
	}

	/** @deprecated Use `LicenseState.isSourceControlLicensed` instead. */
	isSourceControlLicensed() {
		return this.isLicensed(LICENSE_FEATURES.SOURCE_CONTROL);
	}

	/** @deprecated Use `LicenseState.isExternalSecretsLicensed` instead. */
	isExternalSecretsEnabled() {
		return this.isLicensed(LICENSE_FEATURES.EXTERNAL_SECRETS);
	}

	/** @deprecated Use `LicenseState.isAPIDisabled` instead. */
	isAPIDisabled() {
		return this.isLicensed(LICENSE_FEATURES.API_DISABLED);
	}

	/** @deprecated Use `LicenseState.isWorkerViewLicensed` instead. */
	isWorkerViewLicensed() {
		return this.isLicensed(LICENSE_FEATURES.WORKER_VIEW);
	}

	/** @deprecated Use `LicenseState.isProjectRoleAdminLicensed` instead. */
	isProjectRoleAdminLicensed() {
		return this.isLicensed(LICENSE_FEATURES.PROJECT_ROLE_ADMIN);
	}

	/** @deprecated Use `LicenseState.isProjectRoleEditorLicensed` instead. */
	isProjectRoleEditorLicensed() {
		return this.isLicensed(LICENSE_FEATURES.PROJECT_ROLE_EDITOR);
	}

	/** @deprecated Use `LicenseState.isProjectRoleViewerLicensed` instead. */
	isProjectRoleViewerLicensed() {
		return this.isLicensed(LICENSE_FEATURES.PROJECT_ROLE_VIEWER);
	}

	/** @deprecated Use `LicenseState.isCustomNpmRegistryLicensed` instead. */
	isCustomNpmRegistryEnabled() {
		return this.isLicensed(LICENSE_FEATURES.COMMUNITY_NODES_CUSTOM_REGISTRY);
	}

	/** @deprecated Use `LicenseState.isFoldersLicensed` instead. */
	isFoldersEnabled() {
		return this.isLicensed(LICENSE_FEATURES.FOLDERS);
	}

	getCurrentEntitlements(): TEntitlement[] {
		return [];
	}

	getValue<T extends keyof FeatureReturnType>(feature: T): FeatureReturnType[T] {
		return localLicenseFeatures[feature];
	}

	getManagementJwt(): string {
		return '';
	}

	getMainPlan(): TEntitlement | undefined {
		return undefined;
	}

	getConsumerId() {
		return 'local';
	}

	// Helper functions for computed data

	/** @deprecated Use `LicenseState` instead. */
	getUsersLimit() {
		return this.getValue(LICENSE_QUOTAS.USERS_LIMIT) ?? UNLIMITED_LICENSE_QUOTA;
	}

	/** @deprecated Use `LicenseState` instead. */
	getTriggerLimit() {
		return this.getValue(LICENSE_QUOTAS.TRIGGER_LIMIT) ?? UNLIMITED_LICENSE_QUOTA;
	}

	/** @deprecated Use `LicenseState` instead. */
	getVariablesLimit() {
		return this.getValue(LICENSE_QUOTAS.VARIABLES_LIMIT) ?? UNLIMITED_LICENSE_QUOTA;
	}

	/** @deprecated Use `LicenseState` instead. */
	getAiCredits() {
		return this.getValue(LICENSE_QUOTAS.AI_CREDITS) ?? 0;
	}

	/** @deprecated Use `LicenseState` instead. */
	getWorkflowHistoryPruneLimit() {
		return (
			this.getValue(LICENSE_QUOTAS.WORKFLOW_HISTORY_PRUNE_LIMIT) ??
			DEFAULT_WORKFLOW_HISTORY_PRUNE_LIMIT
		);
	}

	/** @deprecated Use `LicenseState` instead. */
	getTeamProjectLimit() {
		return this.getValue(LICENSE_QUOTAS.TEAM_PROJECT_LIMIT) ?? 0;
	}

	getPlanName(): string {
		return this.getValue('planName') ?? 'Community';
	}

	getExpiryDate(): Date | null {
		return null;
	}

	getTerminationDate(): Date | null {
		return null;
	}

	getExpiringInDays(): number | undefined {
		return undefined;
	}

	getTerminatingInDays(): number | undefined {
		return undefined;
	}

	getInfo(): string {
		return 'Enterprise features are available locally. No license server is used.';
	}

	/** @deprecated Use `LicenseState` instead. */
	isWithinUsersLimit() {
		// oxlint-disable-next-line typescript/no-deprecated
		return this.getUsersLimit() === UNLIMITED_LICENSE_QUOTA;
	}
}
