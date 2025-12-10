import { A, useLocation } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";

const Nav = () => {
	const location = useLocation();

	const [isMenuOpen, setIsMenuOpen] = createSignal(false);

	const menuItems = [
		{ id: "/about", label: "Sobre Nosotros" },
		{ id: "/services", label: "Servicios" },
		{ id: "/gallery", label: "Galería" },
		{ id: "/contact", label: "Contacto" },
		{ id: "/login", label: "Login" },
	];

	const activeClass = (path: string) =>
		path == location.pathname ? "text-white" : "text-gray-800";

	return (
		<div class="navbar sticky top-0 z-50 px-4 lg:px-8">
			<div class="navbar-start">
				<A
					class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold"
					href="/"
				>
					SG
				</A>
			</div>

			<div class="navbar-end">
				{/* Desktop Menu */}
				<ul class="menu menu-horizontal px-1 hidden lg:flex">
					<For each={menuItems}>
						{(item) => (
							<li>
								<A class={`${activeClass(item.id)}`} href={item.id}>
									{item.label}
								</A>
							</li>
						)}
					</For>
				</ul>

				{/* Mobile Menu Button */}
				<div class="dropdown dropdown-end lg:hidden">
					<label
						tabindex="0"
						class={`btn btn-ghost ${activeClass("/")}`}
						type="button"
						onClick={() => setIsMenuOpen((state) => !state)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</label>
					<Show when={isMenuOpen()}>
						<ul
							tabindex="0"
							class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
						>
							<For each={menuItems}>
								{(item) => (
									<li>
										<A class={`${activeClass(item.id)}`} href={item.id}>
											{item.label}
										</A>
									</li>
								)}
							</For>
						</ul>
					</Show>
				</div>
			</div>
		</div>
	);
};

export default Nav;
