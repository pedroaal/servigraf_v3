import { createForm, setValues, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, For } from "solid-js";
import { boolean, object, string } from "valibot";
import BlueBoard from "~/components/core/BlueBoard";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import DashboardLayout from "~/components/layout/Dashboard";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { useAuth } from "~/context/auth";
import { listModules } from "~/services/users/modules";
import {
	listProfileModules,
	syncProfileModules,
} from "~/services/users/profileModules";
import {
	createProfile,
	getProfile,
	updateProfile,
} from "~/services/users/profiles";
import { listRoles } from "~/services/users/roles";
import type { Modules, Profiles } from "~/types/appwrite";

const ProfileSchema = object({
	name: string(),
	description: string(),
	status: boolean(),
});

type ProfileForm = Omit<Profiles, "$id" | "companyId" | "deletedAt">;

const ProfilePage = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { authStore } = useAuth();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => !!params.id;

	const [modules] = createResource(
		() => authStore.session?.prefs.companyId || "",
		listModules,
	);
	const [roles] = createResource(listRoles);

	const [profile] = createResource(() => params.id ?? "", getProfile);
	const [profileModules] = createResource(
		() => params.id ?? "",
		listProfileModules,
	);

	const roleLevels = () => {
		if (!roles()?.rows) return {};

		const rolesMap: Record<string, number> = {};
		for (const rol of roles()!.rows) {
			rolesMap[rol.$id] = rol.level;
		}

		return rolesMap;
	};

	// Store selected module-role relationships
	const [selectedModules, setSelectedModules] = createSignal<
		Record<string, string>
	>({});

	const [form, { Form, Field }] = createForm<ProfileForm>({
		validate: valiForm(ProfileSchema),
		initialValues: {
			name: "",
			description: "",
			status: true,
		},
	});

	// Load profile data
	createEffect(() => {
		if (profile() && isEdit()) {
			setValues(form, {
				name: profile()?.name || "",
				description: profile()?.description || "",
				status: profile()?.status ?? true,
			});
		}
	});

	// Load profile modules relationships
	createEffect(() => {
		if (!profileModules()?.rows) return;

		const moduleMap: Record<string, string> = {};
		for (const pm of profileModules()!.rows) {
			moduleMap[pm.moduleId] = pm.roleId;
		}

		setSelectedModules(moduleMap);
	});

	const getRole = (level: number): string =>
		Object.keys(roleLevels()).find((key) => roleLevels()[key] === level) || "";

	// Toggle individual checkbox
	const handleCheckboxChange = (moduleId: string, roleId: string) => {
		setSelectedModules((prev) => {
			const current = prev[moduleId] || "";
			const newState = { ...prev };

			if (roleLevels()[current] >= roleLevels()[roleId]) {
				// Uncheck:  remove all higher roleIds
				newState[moduleId] = getRole(roleLevels()[roleId] - 1);
			} else {
				// Check: select up to this roleId
				newState[moduleId] = roleId;
			}

			// If 0, remove from object
			if (newState[moduleId] === "") {
				delete newState[moduleId];
			}

			return newState;
		});
	};

	// Check if module has role level
	const hasRole = (moduleId: string, roleId: string): boolean => {
		return (
			roleLevels()[selectedModules()[moduleId] || ""] >= roleLevels()[roleId]
		);
	};

	// Toggle all checkboxes in a column
	const toggleAll = (roleId: string) => {
		const allModules = modules()?.rows || [];
		const allChecked = allModules.every((m) => hasRole(m.$id, roleId));

		setSelectedModules((prev) => {
			const newState = { ...prev };
			for (const module of allModules) {
				if (allChecked) {
					// Uncheck all at this level and above
					if (roleLevels()[newState[module.$id]] >= roleLevels()[roleId]) {
						newState[module.$id] = getRole(roleLevels()[roleId] - 1);
					}
				} else {
					// Check all up to this level
					newState[module.$id] = getRole(
						Math.max(
							roleLevels()[newState[module.$id] || ""] || 0,
							roleLevels()[roleId],
						),
					);
				}

				if (newState[module.$id] === "") {
					delete newState[module.$id];
				}
			}
			return newState;
		});
	};

	const handleSubmit = async (values: ProfileForm) => {
		const loaderId = addLoader();
		try {
			const payload: Partial<Profiles> = {
				name: values.name,
				description: values.description,
				status: values.status,
				companyId: authStore.session?.prefs.companyId || "",
				deletedAt: null,
			};

			let profileId: string;

			if (isEdit()) {
				await updateProfile(params.id!, payload);
				profileId = params.id!;
				addAlert({ type: "success", message: "Perfil actualizado con éxito" });
			} else {
				const newProfile = await createProfile(payload as Profiles);
				profileId = newProfile.$id;
				addAlert({ type: "success", message: "Perfil creado con éxito" });
			}

			// Sync module-role relationships
			const moduleRelations = Object.entries(selectedModules()).map(
				([moduleId, roleId]) => ({
					moduleId,
					roleId,
				}),
			);

			await syncProfileModules(profileId, moduleRelations);

			navigate(Routes.profiles);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar perfil",
			});
		} finally {
			removeLoader(loaderId);
		}
	};

	return (
		<>
			<Title>Perfil - Grafos</Title>
			<DashboardLayout>
				<BlueBoard
					title="Gestionar Perfil"
					actions={[
						{
							label: "Guardar",
							onClick: () => {
								const formElement = document.getElementById(
									"profileForm",
								) as HTMLFormElement;
								formElement?.requestSubmit();
							},
						},
					]}
				>
					<Form id="profileForm" onSubmit={handleSubmit} class="space-y-6">
						{/* Basic Info */}
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-5">
								<Field name="name">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Nombre"
											placeholder="Nombre del perfil"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="description">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Descripción"
											placeholder="Descripción del perfil"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-1 flex items-end">
								<Field name="status" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Activo"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
							</div>
						</div>

						{/* Modules Permissions Table */}
						<div class="overflow-x-auto">
							<table class="table table-zebra table-sm">
								<thead>
									<tr>
										<th class="w-2/5">Módulos del perfil</th>
										<For each={roles()?.rows}>
											{(role) => (
												<th class="w-15 text-center">
													<button
														type="button"
														class="btn btn-xs btn-ghost"
														onClick={() => toggleAll(role.$id)}
													>
														{role.name}
													</button>
												</th>
											)}
										</For>
									</tr>
								</thead>
								<tbody>
									<For each={modules()?.rows}>
										{(module: Modules) => (
											<tr>
												<td class={module.isMain ? "" : "pl-10"}>
													{module.name}
												</td>
												{roles()?.rows.map((role) => (
													<td class="text-center">
														<input
															type="checkbox"
															class="checkbox checkbox-sm"
															checked={hasRole(module.$id, role.$id)}
															onChange={() =>
																handleCheckboxChange(module.$id, role.$id)
															}
														/>
													</td>
												))}
											</tr>
										)}
									</For>
								</tbody>
							</table>
						</div>
					</Form>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default ProfilePage;
