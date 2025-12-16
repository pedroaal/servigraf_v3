import type { Component } from "solid-js";

interface IProps {
	colspan?: number;
}

const EmptyTable: Component<IProps> = (props) => {
	return (
		<tr>
			<td colspan={props.colspan} class="text-center py-8">
				No hay datos registrados. Haz clic en "Nuevo" para crear uno.
			</td>
		</tr>
	);
};

export default EmptyTable;
