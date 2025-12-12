import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { ClientFollowers } from "~/types/appwrite";

export const listClientFollowers = async (options?: {
	userId?: string;
	clientId?: string;
}) => {
	const queries = [Query.equal("deletedAt", false)];
	if (options?.userId) queries.push(Query.equal("userId", options.userId));
	if (options?.clientId)
		queries.push(Query.equal("clientId", options.clientId));

	const res = await tables.listRows<ClientFollowers>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_FOLLOWERS,
		queries,
	});
	return res;
};

export const getClientFollower = async (id: string) => {
	const res = await tables.getRow<ClientFollowers>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_FOLLOWERS,
		rowId: id,
	});
	return res;
};

export const createClientFollower = async (payload: ClientFollowers) => {
	const res = await tables.createRow<ClientFollowers>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_FOLLOWERS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateClientFollower = async (
	id: string,
	payload: Partial<ClientFollowers>,
) => {
	const res = await tables.updateRow<ClientFollowers>({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_FOLLOWERS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteClientFollower = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.CLIENT_FOLLOWERS,
		rowId: id,
	});
};
