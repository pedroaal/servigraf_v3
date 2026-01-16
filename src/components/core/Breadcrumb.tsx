import { A } from "@solidjs/router";
import { type Component, For, Show } from "solid-js";

interface IProps {
	links: Array<{
		label: string;
		route?: string;
	}>;
}

const Breadcrumb: Component<IProps> = (props) => {
	return (
		<div class="breadcrumbs text-sm">
			<ul>
				<For each={props.links}>
					{(item) => (
						<li>
							<Show when={item.route} fallback={item.label}>
								<A href={item.route ?? ""}>{item.label}</A>
							</Show>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
};

export default Breadcrumb;
