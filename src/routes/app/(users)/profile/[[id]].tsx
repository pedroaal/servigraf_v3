import { createForm, setValues } from "@modular-forms/solid";
import { useParams } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import BlueBoard from "~/components/core/BlueBoard";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import DashboardLayout from "~/components/layout/Dashboard";
import { useAuth } from "~/context/auth";
import { getProfile } from "~/services/users/profiles";
import type { Profiles } from "~/types/appwrite";

const ProfilePage = () => {
	const params = useParams();
	const { authStore } = useAuth();
	const [profile] = createResource(() => params.id ?? "", getProfile);

	const [form, { Form, Field }] = createForm<Profiles>({
		initialValues: {
			companyId: authStore.session?.prefs.companyId || "",
			name: "",
			description: "",
			status: true,
		},
	});

	createEffect(() => {
		if (profile()) {
			setValues(form, {
				name: profile()?.name,
				description: profile()?.description,
				status: profile()?.status,
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
				title="Gesitonar Perfil"
				actions={[{ label: "Guardar", onClick: () => handleSubmit }]}
			>
				<Form class="space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Field name="name">
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
						<Field name="description">
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
				</Form>
			</BlueBoard>
		</DashboardLayout>
	);
};

export default ProfilePage;
