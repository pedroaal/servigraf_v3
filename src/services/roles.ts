import { DATABASE_ID, TABLES } from "~/config/db";
import { makeId, tables } from "~/lib/appwrite";
import type { Roles } from "~/types/appwrite";

export const listRoles = async () => {
	const res = await tables.listRows<Roles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ROLES,
	});
	return res;
};

export const getRole = async (id: string) => {
	const res = await tables.getRow<Roles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ROLES,
		rowId: id,
	});
	return res;
};

export const createRole = async (payload: Roles) => {
	const res = await tables.createRow<Roles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ROLES,
		rowId: makeId(),
		data: payload,
	});
	return res;
};

export const updateRole = async (id: string, payload: Partial<Roles>) => {
	const res = await tables.updateRow<Roles>({
		databaseId: DATABASE_ID,
		tableId: TABLES.ROLES,
		rowId: id,
		data: payload,
	});
	return res;
};

export const deleteRole = (id: string) => {
	return tables.deleteRow({
		databaseId: DATABASE_ID,
		tableId: TABLES.ROLES,
		rowId: id,
	});
};
