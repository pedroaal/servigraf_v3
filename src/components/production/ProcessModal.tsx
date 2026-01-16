import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { Modal } from "../core/Modal";

const ProcessModal = () => {
	const { closeModal } = useApp();

	return <Modal title="Gestionar Proceso" id={Modals.Process}></Modal>;
};

export default ProcessModal;
