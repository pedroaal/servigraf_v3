import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { Modal } from "../core/Modal";

const MaterialModal = () => {
	const { closeModal } = useApp();

	return <Modal title="Gestionar Material" id={Modals.Material}></Modal>;
};

export default MaterialModal;
