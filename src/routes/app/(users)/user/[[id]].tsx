import { createForm, setValues } from "@modular-forms/solid";
import { useParams } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import BlueBoard from "~/components/core/BlueBoard";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import DashboardLayout from "~/components/layout/Dashboard";
import { useAuth } from "~/context/auth";
import { getUser } from "~/services/users/users";
import type { Users } from "~/types/appwrite";

const UserPage = () => {
	const params = useParams();
	const { authStore } = useAuth();
	const [user] = createResource(() => params.id ?? "", getUser);

	const [form, { Form, Field }] = createForm<Users>({
		initialValues: {
			idNumber: "",
			companyId: authStore.session?.prefs.companyId || "",
			status: true,
			reserveOrder: false,
			bookAccess: false,
			profitAccess: false,
			isSuperAdmin: false,
			profileId: undefined,
			firstName: "",
			lastName: "",
		},
	});

	createEffect(() => {
		if (user()) {
			console.log(user());
			setValues(form, {
				idNumber: user()?.idNumber,
				companyId: user()?.companyId,
				status: user()?.status,
				reserveOrder: user()?.reserveOrder,
				bookAccess: user()?.bookAccess,
				profitAccess: user()?.profitAccess,
				isSuperAdmin: user()?.isSuperAdmin,
				profileId: user()?.profileId,
				firstName: user()?.firstName,
				lastName: user()?.lastName,
			});
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		// await onSubmit(form());
	}

	return (
		<DashboardLayout>
			<BlueBoard
				title="Gesitonar Usuario"
				actions={[{ label: "Guardar", onClick: () => handleSubmit }]}
			>
				<Form class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Field name="idNumber">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Cedula"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
						<Field name="firstName">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Nombre"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
						<Field name="lastName">
							{(field, props) => (
								<Input
									{...props}
									type="text"
									label="Apellido"
									value={field.value}
									error={field.error}
									required
								/>
							)}
						</Field>
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
						<Field name="reserveOrder" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Reservar Ordenes"
									checked={field.value}
									error={field.error}
								/>
							)}
						</Field>
						<Field name="bookAccess" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Libros"
									checked={field.value}
									error={field.error}
								/>
							)}
						</Field>
						<Field name="profitAccess" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Utilidades"
									checked={field.value}
									error={field.error}
								/>
							)}
						</Field>
						<Field name="isSuperAdmin" type="boolean">
							{(field, props) => (
								<Checkbox
									{...props}
									label="Administrador"
									checked={field.value}
									error={field.error}
								/>
							)}
						</Field>
					</div>
				</Form>
			</BlueBoard>
		</DashboardLayout>
	);
};

export default UserPage;
