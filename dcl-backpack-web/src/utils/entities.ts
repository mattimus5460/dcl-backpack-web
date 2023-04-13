import { ethers } from 'ethers'
import { Authenticator, AuthChain } from '@dcl/crypto'
import { Entity, EntityType } from '@dcl/schemas/dist/platform/entity'
import { CatalystClient } from 'dcl-catalyst-client/dist/CatalystClient'
import { BuildEntityWithoutFilesOptions } from 'dcl-catalyst-client/dist/ContentClient'

//import { PeerAPI } from './peer'
import {Web3Provider} from "@ethersproject/providers/src.ts/web3-provider";
import {Avatar, Profile} from "@dcl/schemas";
import {Snapshots} from "@dcl/schemas/dist/platform/profile/avatar";

export const getHashesByKeyMap = (snapshots: Snapshots) => {

	console.log("hhh "+JSON.stringify(snapshots))

	const hashesByKey = new Map()
	Object.entries(snapshots).forEach(([key, value]) => {
		console.log(`${key}.png ${ removeUrlFromSnapshot(value)}`)
		hashesByKey.set(`${key}.png`, removeUrlFromSnapshot(value))
	})

	console.log("hhh2 "+JSON.stringify(hashesByKey))
	Object.entries(hashesByKey).forEach(([key, value]) => {
		console.log(`dd ${key}.png ${value}`)
	})

	return hashesByKey
}

const removeUrlFromSnapshot = (snap:string) =>{
	const split = snap.split("/")
	return split[split.length -1]
}


export class EntitiesOperator {
	private readonly catalystClient: CatalystClient
	// this is a temporal work-around to fix profile deployment issues on catalysts with Garbage Collector
	private readonly catalystClientWithoutGbCollector: CatalystClient | null
	//private readonly peerAPI: PeerAPI
	private readonly provider: Web3Provider

	constructor(peerUrl: string, provider: Web3Provider, peerWithNoGbCollectorUrl?: string, ) {
		this.catalystClient = new CatalystClient({ catalystUrl: peerUrl })
		this.catalystClientWithoutGbCollector = peerWithNoGbCollectorUrl
			? new CatalystClient({
				catalystUrl: peerWithNoGbCollectorUrl
			})
			: null
		//this.peerAPI = new PeerAPI(peerUrl)
		this.provider = provider
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
		entityId: string
	): Promise<AuthChain> {

		const eth = this.provider

		const personal = eth.getSigner()
		const signature = await personal.signMessage(entityId)

		return Authenticator.createSimpleAuthChain(entityId, address.toLowerCase(), signature)
	}

	/**
	 * Gets the first {@link ProfileEntity} out of multiple possible profile entities or
	 * returns the last one in case the given address has no profile entities.
	 *
	 * @param address - The address that owns the profile entity being retrieved.
	 */
	// async getProfileEntity(address: string): Promise<ProfileEntity> {
	// 	const entities: Entity[] = await this.catalystClient.fetchEntitiesByPointers(
	// 		[address.toLowerCase()]
	// 	)
	//
	// 	if (entities.length > 0) {
	// 		return entities[0] as ProfileEntity
	// 	}
	//
	// 	return this.peerAPI.getDefaultProfileEntity()
	// }

	/**
	 * Deploys an entity of a determined type.
	 * This method will build everything related to the deployment of
	 * the entity and will prompt the user for their signature before
	 * doing a deployment.
	 *
	 * @param entity - The title of the book.
	 * @param entityType - The type of the entity.
	 * @param address - The owner / soon to be owner of the entity.
	 */
	async deployEntityWithoutNewFiles(
		entityMetadata: Entity['metadata'],
		hashesByKey: Map<string, string>,
		entityType: EntityType,
		pointer: string,
		address: string
	): Promise<any> {
		console.log("hbkm "+hashesByKey)

		const options: BuildEntityWithoutFilesOptions = {
			type: entityType,
			pointers: [pointer],
			metadata: entityMetadata,
			timestamp: Date.now(),
			hashesByKey: hashesByKey
		}

		console.log(
			JSON.stringify(options, null, 2))

		const entityToDeploy = await this.catalystClient.buildEntityWithoutNewFiles(
			options
		)

		const authChain: AuthChain = await this.authenticateEntityDeployment(
			address,
			entityToDeploy.entityId
		)

		const catalystClient =
			this.catalystClientWithoutGbCollector ?? this.catalystClient

		return catalystClient.deploy({
			...entityToDeploy,
			authChain
		})
	}
}
