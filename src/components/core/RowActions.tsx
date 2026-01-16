import { FaSolidPencil, FaSolidTrash } from "solid-icons/fa";
import { type Component, Show } from "solid-js";

interface IProps {
	onEdit?: () => void;
	onDelete?: () => void;
}

const RowActions: Component<IProps> = (props) => {
	return (
		<div class="flex gap-2">
			<Show when={props.onEdit}>
				<button
					type="button"
					class="btn btn-sm btn-square btn-ghost"
					onClick={props.onEdit}
				>
					<FaSolidPencil size={16} />
				</button>
			</Show>
			<Show when={props.onDelete}>
				<button
					type="button"
					class="btn btn-sm btn-square btn-ghost btn-error"
					onClick={props.onDelete}
				>
					<FaSolidTrash size={16} />
				</button>
			</Show>
		</div>
	);
};

export default RowActions;
