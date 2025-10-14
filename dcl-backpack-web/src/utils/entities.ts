import {BrowserProvider} from "ethers";
import {AuthChain, Authenticator} from "@dcl/crypto";
import {Entity, EntityType} from "@dcl/schemas/dist/platform/entity";
//import { CatalystClient } from 'dcl-catalyst-client/dist/CatalystClient'
//import { BuildEntityWithoutFilesOptions } from 'dcl-catalyst-client/dist/ContentClient'
//import { PeerAPI } from './peer'
import {ContentMapping, Profile} from "@dcl/schemas";
import {Snapshots} from "@dcl/schemas/dist/platform/profile/avatar";
import {createFetchComponent} from "@well-known-components/fetch-component";
import {createCatalystClient} from "dcl-catalyst-client";
import {
	buildEntity,
	buildEntityAndFile,
	DeploymentPreparationData,
} from "dcl-catalyst-client/dist/client";
import {IFetchComponent} from "@well-known-components/interfaces";
import {hashV1} from "@dcl/hashing";

export const getHashesByKeyMap = (snapshots: Snapshots) => {

	console.log("hhh " + JSON.stringify(snapshots));

	const hashesByKey = new Map();
	Object.entries(snapshots).forEach(([key, value]) => {
		console.log(`${key}.png ${removeUrlFromSnapshot(value)}`);
		hashesByKey.set(`${key}.png`, removeUrlFromSnapshot(value));
	});

	console.log("hhh2 " + JSON.stringify(hashesByKey));
	Object.entries(hashesByKey).forEach(([key, value]) => {
		console.log(`dd ${key}.png ${value}`);
	});

	return hashesByKey;
};

const removeUrlFromSnapshot = (snap: string) => {
	const split = snap.split("/");
	return split[split.length - 2];
};


export class EntitiesOperator {

	//private readonly catalystClient: CatalystClient
	//private readonly peerAPI: PeerAPI
	private readonly peerUrl: string;
	private readonly provider: BrowserProvider;

	constructor(peerUrl: string, provider: BrowserProvider, peerWithNoGbCollectorUrl?: string) {

		this.peerUrl = peerUrl;

		//this.catalystClient =
		// this.catalystClientWithoutGbCollector = peerWithNoGbCollectorUrl
		// 	? new CatalystClient({
		// 		catalystUrl: peerWithNoGbCollectorUrl
		// 	})
		// 	: null
		//this.peerAPI = new PeerAPI(peerUrl)
		this.provider = provider;
	}

	/**
	 * Uses the provider to request the user for a signature to
	 * deploy an entity.
	 *
	 * @param address - The address of the deployer of the entity.
	 * @param entityId - The entity id that it's going to be deployed.
	 */
	private async authenticateEntityDeployment(
		address: string,
		entityId: string,
	): Promise<AuthChain> {
		const eth = this.provider;
		const personal = await eth.getSigner();
		const signature = await personal.signMessage(entityId);
		return Authenticator.createSimpleAuthChain(entityId, address, signature);
	}

	/**
	 * Deploys an entity without uploading new files by leveraging existing content on a Catalyst server.
	 *
	 * @param entityMetadata The metadata of the entity to be deployed.
	 * @param hashesByKey A map that associates keys with the corresponding content hashes for the entity.
	 * @param entityType The type of the entity being deployed.
	 * @param pointer The identifier or pointer for the entity.
	 * @param address The address of the user deploying the entity*/
	async deployEntityWithoutNewFiles(
		entityMetadata: Entity["metadata"],
		hashesByKey: Map<string, string>,
		entityType: EntityType,
		pointer: string,
		address: string,
	): Promise<any> {

		const fetcher = createFetchComponent();
		const catalystClient = createCatalystClient({
			url: this.peerUrl,
			fetcher,
		});
		const entityFiles = new Map<string, Uint8Array>();
		entityFiles.set("body.png", new Uint8Array([]));
		entityFiles.set("face256.png", new Uint8Array([]));

		const {files, entityId} = await buildEntityWithoutNewFiles(fetcher, {
			contentUrl: this.peerUrl,
			type: entityType,
			pointers: [pointer],
			metadata: entityMetadata,
			hashesByKey: hashesByKey,
			timestamp: Date.now(),
		});

		const contentClient = await catalystClient.getContentClient();

		const authChain: AuthChain = await this.authenticateEntityDeployment(
			address.toLowerCase(),
			entityId,
		);

		return (await contentClient.deploy({
			files,
			entityId,
			authChain,
		})) as any;
	}
}


export async function buildEntityWithoutNewFiles(
	fetcher: IFetchComponent,
	{
		contentUrl,
		type,
		pointers,
		hashesByKey,
		metadata,
		timestamp,
	}: {
		contentUrl: string
		type: EntityType
		pointers: string[]
		hashesByKey?: Map<string, string>
		metadata?: any
		timestamp?: number
	},
): Promise<DeploymentPreparationData> {
	const givenFilesMaps: Map<string, string> | undefined = hashesByKey ?? metadata ? getHashesByKey(metadata) : undefined;
	// When the old entity has the old hashing algorithm, then the full entity with new hash will need to be deployed.
	if (!!givenFilesMaps && isObsoleteProfile(type, givenFilesMaps)) {
		const files = await downloadAllFiles(fetcher, contentUrl, givenFilesMaps);
		const metadataWithNewHash = await updateMetadata(files, metadata);
		return buildEntity({
			type,
			pointers,
			files,
			metadata: metadataWithNewHash,
			timestamp,
		});
	}
	return buildEntityInternal(type, pointers, {
		hashesByKey,
		metadata,
		timestamp,
	});
}

async function updateMetadata(files: Map<string, Uint8Array>, metadata?: any) {
	if (!metadata) return metadata;

	metadata.avatars = await Promise.all(
		(metadata as Profile).avatars.map(async (avatar) => {
			const newSnapshots = {face256: "", body: ""};

			const face256Content = files.get("face256.png");
			if (!!face256Content) {
				newSnapshots["face256"] = await hashV1(face256Content);
			}
			const bodyContent = files.get("body.png");
			if (!!bodyContent) {
				newSnapshots["body"] = await hashV1(bodyContent);
			}
			avatar.avatar.snapshots = newSnapshots;
			return avatar;
		}),
	);

	return metadata;
}

function getHashesByKey(metadata: any): Map<string, string> {
	const avatar = (metadata as Profile).avatars[0];
	return new Map([
		["body.png", avatar.avatar.snapshots.body],
		["face256.png", avatar.avatar.snapshots.face256],
	]);
}

function isObsoleteProfile(type: EntityType, hashesByKey: Map<string, string>): boolean {
	return type === EntityType.PROFILE && Array.from(hashesByKey).some(([, hash]) => hash.toLowerCase().startsWith("qm"));
}

async function buildEntityInternal(
	type: EntityType,
	pointers: string[],
	options?: BuildEntityInternalOptions,
): Promise<DeploymentPreparationData> {
	// Make sure that there is at least one pointer
	if (pointers.length === 0) {
		throw new Error(`All entities must have at least one pointer.`);
	}

	// Re-organize the hashes
	const hashesByKey: Map<string, string> = options?.hashesByKey ? options?.hashesByKey : new Map();
	const entityContent: ContentMapping[] = Array.from(hashesByKey.entries()).map(([key, hash]) => ({
		file: key,
		hash,
	}));

	// Calculate timestamp if necessary
	const timestamp: number = options?.timestamp ? options?.timestamp : Date.now();

	// Build entity file
	const {entity, entityFile} = await buildEntityAndFile({
		type,
		pointers,
		timestamp,
		content: entityContent,
		metadata: options?.metadata,
	});

	// Add entity file to content files
	const filesByHash: Map<string, Uint8Array> = options?.filesByHash ? options.filesByHash : new Map();
	filesByHash.set(entity.id, entityFile);

	return {files: filesByHash, entityId: entity.id};
}

type BuildEntityInternalOptions = {
	hashesByKey?: Map<string, string>
	filesByHash?: Map<string, Uint8Array>
	metadata?: any
	timestamp?: number
}

async function downloadAllFiles(
	fetcher: IFetchComponent,
	contentUrl: string,
	hashes: Map<string, string>,
): Promise<Map<string, Uint8Array>> {
	const oldBodyHash = hashes.get("body.png");
	const oldFaceHash = hashes.get("face256.png");

	const bodyUrl = new URL(`${contentUrl}/contents/${oldBodyHash}`).toString();
	const faceUrl = new URL(`${contentUrl}/contents/${oldFaceHash}`).toString();

	const [bodyFileContent, faceFileContent] = await Promise.all([
		fetchArrayBuffer(fetcher, bodyUrl),
		fetchArrayBuffer(fetcher, faceUrl),
	]);

	return new Map([
		["body.png", bodyFileContent],
		["face256.png", faceFileContent],
	]);
}

async function fetchArrayBuffer(fetcher: IFetchComponent, url: string) {
	const response = await fetcher.fetch(url);
	const buffer = await response.arrayBuffer();
	return new Uint8Array(buffer);
}
