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

	const [profile] = createResource(() => params.id ?? "", getProfile);
	const [modules] = createResource(
		() => authStore.session?.prefs.companyId || "",
		listModules,
	);
	const [roles] = createResource(listRoles);
	const [profileModules] = createResource(
		() => params.id ?? "",
		listProfileModules,
	);

	// Store selected module-role relationships
	const [selectedModules, setSelectedModules] = createSignal<
		Record<string, number>
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
		if (profileModules()?.rows) {
			const moduleMap: Record<string, number> = {};
			for (const pm of profileModules()!.rows) {
				// Convert roleId to number (1=Ver, 2=Crear, 3=Modificar, 4=Eliminar)
				const roleLevel = getRoleLevel(pm.roleId as any);
				moduleMap[pm.moduleId as any] = roleLevel;
			}
			setSelectedModules(moduleMap);
		}
	});

	// Helper:  Get role level from role ID
	const getRoleLevel = (roleId: string): number => {
		const role = roles()?.rows.find((r) => r.$id === roleId);
		if (!role) return 0;
		// Assuming roles are named:  "Ver", "Crear", "Modificar", "Eliminar"
		if (role.name === "Ver") return 1;
		if (role.name === "Crear") return 2;
		if (role.name === "Modificar") return 3;
		if (role.name === "Eliminar") return 4;
		return 0;
	};

	// Helper: Get role ID by level
	const getRoleIdByLevel = (level: number): string => {
		const roleName = ["", "Ver", "Crear", "Modificar", "Eliminar"][level];
		return roles()?.rows.find((r) => r.name === roleName)?.$id || "";
	};

	// Toggle individual checkbox
	const handleCheckboxChange = (moduleId: string, level: number) => {
		setSelectedModules((prev) => {
			const current = prev[moduleId] || 0;
			const newState = { ...prev };

			if (current >= level) {
				// Uncheck:  remove all higher levels
				newState[moduleId] = level - 1;
			} else {
				// Check: select up to this level
				newState[moduleId] = level;
			}

			// If 0, remove from object
			if (newState[moduleId] === 0) {
				delete newState[moduleId];
			}

			return newState;
		});
	};

	// Check if module has role level
	const hasRole = (moduleId: string, level: number): boolean => {
		return (selectedModules()[moduleId] || 0) >= level;
	};

	// Toggle all checkboxes in a column
	const toggleAll = (level: number) => {
		const allModules = modules()?.rows || [];
		const allChecked = allModules.every((m) => hasRole(m.$id, level));

		setSelectedModules((prev) => {
			const newState = { ...prev };
			for (const module of allModules) {
				if (allChecked) {
					// Uncheck all at this level and above
					if (newState[module.$id] >= level) {
						newState[module.$id] = level - 1;
					}
				} else {
					// Check all up to this level
					newState[module.$id] = Math.max(newState[module.$id] || 0, level);
				}

				if (newState[module.$id] === 0) {
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
				([moduleId, level]) => ({
					moduleId,
					roleId: getRoleIdByLevel(level),
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
										<th class="w-15 text-center">
											<button
												type="button"
												class="btn btn-xs btn-ghost"
												onClick={() => toggleAll(1)}
											>
												<i class="fas fa-eye" />
												<span class="hidden md:inline ml-1">Ver</span>
											</button>
										</th>
										<th class="w-15 text-center">
											<button
												type="button"
												class="btn btn-xs btn-ghost"
												onClick={() => toggleAll(2)}
											>
												<i class="fas fa-plus" />
												<span class="hidden md:inline ml-1">Crear</span>
											</button>
										</th>
										<th class="w-15 text-center">
											<button
												type="button"
												class="btn btn-xs btn-ghost"
												onClick={() => toggleAll(3)}
											>
												<i class="fas fa-edit" />
												<span class="hidden md:inline ml-1">Modificar</span>
											</button>
										</th>
										<th class="w-15 text-center">
											<button
												type="button"
												class="btn btn-xs btn-ghost"
												onClick={() => toggleAll(4)}
											>
												<i class="fas fa-times" />
												<span class="hidden md:inline ml-1">Eliminar</span>
											</button>
										</th>
									</tr>
								</thead>
								<tbody>
									<For each={modules()?.rows}>
										{(module: Modules) => (
											<tr>
												<td class={module.isMain ? "" : "pl-10"}>
													{module.name}
												</td>
												{[1, 2, 3, 4].map((level) => (
													<td class="text-center">
														<input
															type="checkbox"
															class="checkbox checkbox-sm"
															checked={hasRole(module.$id, level)}
															onChange={() =>
																handleCheckboxChange(module.$id, level)
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
