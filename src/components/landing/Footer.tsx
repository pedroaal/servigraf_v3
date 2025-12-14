import {
	FaBrandsWhatsapp,
	FaSolidEnvelope,
	FaSolidPhone,
} from "solid-icons/fa";

const Footer = () => {
	return (
		<footer class="footer footer-center p-4 bg-primary text-primary-content">
			<div class="flex flex-wrap items-center justify-between w-full max-w-6xl gap-4">
				<div class="font-bold text-lg">ServiGraf</div>
				<div class="flex flex-wrap gap-4">
					<span class="flex items-center gap-2">
						<FaSolidPhone />
						514 3236
					</span>
					<span class="flex items-center gap-2">
						<FaBrandsWhatsapp />
						096 939 4891
					</span>
					<span class="flex items-center gap-2">
						<FaSolidEnvelope />
						info@servigraf.me
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
