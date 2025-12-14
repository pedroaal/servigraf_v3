import type { ParentComponent } from "solid-js";

import Footer from "~/components/landing/Footer";
import Nav from "~/components/landing/Nav";

const MainLayout: ParentComponent = (props) => {
	return (
		<div class="flex flex-col min-h-screen" data-theme="light">
			<Nav />
			<main class="flex-1 p-6">{props.children}</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
