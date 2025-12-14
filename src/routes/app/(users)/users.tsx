import { Title } from "@solidjs/meta";
import {
	FaSolidEye,
	FaSolidMagnifyingGlass,
	FaSolidPencil,
	FaSolidTrash,
} from "solid-icons/fa";
import { createResource, For } from "solid-js";
import BlueBoard from "~/components/core/BlueBoard";
import DashboardLayout from "~/components/layout/Dashboard";
import { Routes } from "~/config/routes";
import { useAuth } from "~/context/auth";
import { listUsers } from "~/services/users/users";

const ClientsPage = () => {
	const { authStore } = useAuth();
	const [users] = createResource(
		() => authStore.session?.prefs.companyId.$id || "",
		(companyId) => listUsers(companyId),
	);

	return (
		<>
			<Title>Usuarios - Grafos</Title>

			<DashboardLayout>
				<div class="flex justify-between items-center">
					<h1 class="text-3xl font-bold">Usuarios</h1>
				</div>

				<BlueBoard
					title="Gestiónar Usuarios"
					links={[
						{
							href: Routes.user,
							label: "Nuevo Usuario",
						},
					]}
				>
					<div class="flex gap-4">
						<div class="form-control flex-1">
							<input
								type="text"
								placeholder="Buscar cliente..."
								class="input input-bordered"
							/>
						</div>
						<button type="button" class="btn btn-secondary">
							<FaSolidMagnifyingGlass size={16} />
						</button>
					</div>

					{/* Table */}
					<div class="overflow-x-auto">
						<table class="table table-zebra">
							<thead>
								<tr>
									<th>Status</th>
									<th>Nombre</th>
									<th>Apellido</th>
									<th>Perfil</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<For
									each={users()}
									fallback={
										<tr>
											<td colspan="4" class="text-center py-8">
												No hay clientes registrados. Haz clic en "Nuevo Cliente"
												para crear uno.
											</td>
										</tr>
									}
								>
									{(item) => (
										<tr>
											<td>{item.status}</td>
											<td>{item.firstName}</td>
											<td>{item.lastName}</td>
											<td>{item.profile}</td>
											<td>
												<div class="flex gap-2">
													<button type="button" class="btn btn-sm">
														<FaSolidEye size={16} />
													</button>
													<button type="button" class="btn btn-sm">
														<FaSolidPencil size={16} />
													</button>
													<button type="button" class="btn btn-sm btn-error">
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

export default ClientsPage;
