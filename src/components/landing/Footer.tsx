import { FaBrandsWhatsapp, FaSolidEnvelope } from "solid-icons/fa";

const Footer = () => {
	return (
		<footer class="footer footer-center p-4 bg-primary text-primary-content">
			<div class="flex flex-wrap items-center justify-between w-full max-w-6xl gap-4">
				<div class="font-bold text-lg">Grafos</div>
				<div class="flex flex-wrap gap-4">
					<span class="flex items-center gap-2">
						<FaBrandsWhatsapp />
						098 762 0452
					</span>
					<span class="flex items-center gap-2">
						<FaBrandsWhatsapp />
						096 939 4891
					</span>
					<span class="flex items-center gap-2">
						<FaSolidEnvelope />
						servigraf.ec@gmail.me
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
