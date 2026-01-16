import { createResource } from "solid-js";
import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { getArea } from "~/services/production/areas";
import { Modal } from "../core/Modal";

const AreaModal = () => {
	const { appStore, closeModal } = useApp();

	const [area] = createResource(() => appStore.modalProps?.id || "", getArea);

	return <Modal title="Gestionar Area" id={Modals.Area}></Modal>;
};

export default AreaModal;
