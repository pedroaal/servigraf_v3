import { useNavigate } from "@solidjs/router";
import type { Models } from "appwrite";
import { createContext, type ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Routes } from "~/config/routes";
import { account } from "~/lib/appwrite";
import { listUsers } from "~/services/users/users";
import type { Users } from "~/types/appwrite";
import { useApp } from "./app";

type AuthStore = {
	session: Models.User | null;
	user: Users | null;
};

type AuthActions = {
	checkAuth: () => void;
	login: (email: string, password: string) => void;
	logout: () => void;
};

export const AuthContext = createContext<[AuthStore, AuthActions]>([
	{ session: null, user: null },
	{
		login: () => {},
		logout: () => {},
		checkAuth: () => {},
	},
]);

export const useAuth = () => {
	const [authStore, { login, logout, checkAuth }] = useContext(AuthContext);
	return { authStore, login, logout, checkAuth };
};

export const AuthProvider: ParentComponent = (props) => {
	const navigate = useNavigate();
	const { addAlert } = useApp();
	const [store, setStore] = createStore<AuthStore>({
		session: null,
		user: null,
	});

	const actions: AuthActions = {
		async login(email: string, password: string) {
			try {
				await account.createEmailPasswordSession({ email, password });
				const currentSession = await account.get();
				const currentUser = await listUsers(currentSession.prefs.companyId, {
					authId: currentSession.$id,
				});
				setStore("session", currentSession);
				setStore("user", currentUser.rows[0] || null);
				addAlert({ type: "success", message: "Inicio de sesión exitoso" });
				navigate(Routes.dashboard);
				return true;
			} catch (error: any) {
				addAlert({
					type: "error",
					message: error.message || "Error al iniciar sesión",
				});
				return false;
			}
		},
		async logout() {
			try {
				await account.deleteSession({ sessionId: "current" });
				setStore("session", null);
				setStore("user", null);
				addAlert({ type: "success", message: "Sesión cerrada" });
				navigate(Routes.home);
			} catch (error: any) {
				addAlert({
					type: "error",
					message: error.message || "Error al cerrar sesión",
				});
			}
		},
		async checkAuth() {
			if (store.user) {
				return true;
			}

			try {
				const currentUser = await account.get();
				setStore("session", currentUser);
				setStore("user", currentUser);
			} catch (error) {
				setStore("user", null);
				navigate(Routes.login);
			}
		},
	};

	return (
		<AuthContext.Provider value={[store, actions]}>
			{props.children}
		</AuthContext.Provider>
	);
};
