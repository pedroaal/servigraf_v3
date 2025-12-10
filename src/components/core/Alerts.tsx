import {
	FaSolidCircleCheck,
	FaSolidCircleInfo,
	FaSolidCircleXmark,
	FaSolidTriangleExclamation,
	FaSolidX,
} from "solid-icons/fa";
import { type Component, For, Show, useContext } from "solid-js";
import { Portal } from "solid-js/web";

import { PortalContext } from "~/context/portal";
import type { IAlert } from "~/types/alert";

const Alert: Component<IAlert> = (props) => {
	const [_store, { removeAlert }] = useContext(PortalContext);

	const alertClass = () => {
		const baseClass = "alert shadow-lg";
		switch (props.type) {
			case "success":
				return `${baseClass} alert-success`;
			case "error":
				return `${baseClass} alert-error`;
			case "warning":
				return `${baseClass} alert-warning`;
			case "info":
				return `${baseClass} alert-info`;
			default:
				return baseClass;
		}
	};

	const alertIcon = () => {
		switch (props.type) {
			case "success":
				return <FaSolidCircleCheck size={24} />;
			case "error":
				return <FaSolidCircleXmark size={24} />;
			case "warning":
				return <FaSolidTriangleExclamation size={24} />;
			case "info":
				return <FaSolidCircleInfo size={24} />;
			default:
				return <FaSolidCircleInfo size={24} />;
		}
	};

	return (
		<div class={alertClass()}>
			{alertIcon()}
			<span>{props.message}</span>
			<div>
				<button
					class="btn btn-square btn-ghost btn-sm"
					type="button"
					onClick={() => removeAlert(props.id)}
				>
					<FaSolidX />
				</button>
			</div>
		</div>
	);
};

const Alerts: Component = () => {
	const [store] = useContext(PortalContext);

	return (
		<Portal mount={document.getElementById("alerts")!}>
			<Show when={store.alerts.length}>
				<div class="fixed top-4 right-4 w-92 z-50">
					<div class="flex flex-col gap-3 w-full">
						<For each={store.alerts}>{(alert) => <Alert {...alert} />}</For>
					</div>
				</div>
			</Show>
		</Portal>
	);
};

export default Alerts;
