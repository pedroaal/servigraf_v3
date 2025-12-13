import { Query } from "appwrite";
import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Users } from "~/types/appwrite";

export const listUsers = async (companyId: string) => {
	const res = await tables.listRows<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		queries: [
			Query.equal("deletedAt", false),
			Query.equal("companyId", companyId),
		],
	});
	return res;
};

export const getUser = async (id: string) => {
	const res = await tables.getRow<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		rowId: id,
	});
	return res;
};

export const createUser = async (payload: Users) => {
	const res = await tables.createRow<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateUser = async (id: string, payload: Partial<Users>) => {
	const res = await tables.updateRow<Users>({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteUser = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.USERS,
		rowId: id,
	});
};
