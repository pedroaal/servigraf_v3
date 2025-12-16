import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import {
	FaSolidCheck,
	FaSolidPencil,
	FaSolidTrash,
	FaSolidXmark,
} from "solid-icons/fa";
import { createResource, For } from "solid-js";
import BlueBoard from "~/components/core/BlueBoard";
import EmptyTable from "~/components/core/EmptyTable";
import DashboardLayout from "~/components/layout/Dashboard";
import { Routes } from "~/config/routes";
import { useAuth } from "~/context/auth";
import { listProfiles } from "~/services/users/profiles";

const ProfilesPage = () => {
	const navigate = useNavigate();
	const { authStore } = useAuth();

	const [profiles] = createResource(
		() => authStore.session?.prefs.companyId || "",
		(companyId) => listProfiles(companyId),
	);

	const goToProfile = (id: string) => {
		navigate(`${Routes.profile}/${id}`);
	};

	return (
		<>
			<Title>Perfiles - Grafos</Title>
			<DashboardLayout>
				<BlueBoard
					title="Gestiónar Perfiles"
					links={[
						{
							href: Routes.profile,
							label: "Nuevo Perfil",
						},
					]}
				>
					<div class="overflow-x-auto">
						<table class="table table-zebra">
							<thead>
								<tr>
									<th class="w-1/12">Status</th>
									<th>Nombre</th>
									<th>Descripcion</th>
									<th class="w-1/12"></th>
								</tr>
							</thead>
							<tbody>
								<For
									each={profiles()?.rows}
									fallback={<EmptyTable colspan={4} />}
								>
									{(item) => (
										<tr>
											<td>
												{item.status ? (
													<FaSolidCheck size={24} class="text-success" />
												) : (
													<FaSolidXmark size={24} class="text-error" />
												)}
											</td>
											<td>{item.name}</td>
											<td>{item.description}</td>
											<td>
												<div class="flex gap-2">
													<button
														type="button"
														class="btn btn-sm btn-square btn-ghost"
														onClick={[goToProfile, item.$id]}
													>
														<FaSolidPencil size={16} />
													</button>
													<button
														type="button"
														class="btn btn-sm btn-square btn-ghost btn-error"
													>
														<FaSolidTrash size={16} />
													</button>
												</div>
											</td>
										</tr>
									)}
								</For>
							</tbody>
						</table>
					</div>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default ProfilesPage;
