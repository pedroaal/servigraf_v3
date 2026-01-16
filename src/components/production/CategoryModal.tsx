import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { Modal } from "../core/Modal";

const CategoryModal = () => {
	const { closeModal } = useApp();

	return <Modal title="Gestionar Categoria" id={Modals.Category}></Modal>;
};

export default CategoryModal;
