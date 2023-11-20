import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  closeModal,
  openModal,
  modalSelector,
} from "../../../redux/Slice/commonModalSlice";
import Modal from "../../../Components/Modal";
import ResourcesComponent from "./Resources";
import ResourceAction from "./ResourceAction";
import Elements from "./Elements";

import {
  // Resources,
  fetchResources,
  resourcesSelector,
} from "../../../redux/Slice/resourcesSlice";

const Resource = () => {
  const modal = useAppSelector(modalSelector);
  const { resources, selectedResources } = useAppSelector(resourcesSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchResources());
  }, []);

  const renderModalContent = () => {
    if (modal.key === "resource") {
      return (
        <div key={modal.key}>
          <p>resource</p>
        </div>
      );
    }

    if (modal.key === "resource-action") {
      return (
        <div key={modal.key}>
          <p>resource action</p>
        </div>
      );
    }

    if (modal.key === "elements") {
      return (
        <div key={modal.key}>
          <p>elements</p>
        </div>
      );
    }
  };

  const handleAction = (action: string) => {
    if (modal.key === "resource" && action === "Save") {
      dispatch(closeModal({ key: "", open: false }));
    }

    if (modal.key === "resource-action" && action === "Save") {
      dispatch(closeModal({ key: "", open: false }));
    }

    if (modal.key === "elements" && action === "Save") {
      dispatch(closeModal({ key: "", open: false }));
    }

    if (action === "Cancel") {
      dispatch(closeModal({ key: "", open: false }));
    }
  };

  const renderModal = () => {
    return (
      <Modal
        open={
          modal.open &&
          (modal.key === "resource" ||
            modal.key === "resource-action" ||
            modal.key === "elements")
        }
        handleAction={handleAction}
        actions={["Save", "Cancel"]}
      >
        {renderModalContent()}
      </Modal>
    );
  };

  return (
    <div className="flex flex-row">
      {renderModal()}
      <ResourcesComponent />
      {selectedResources.ID ? <ResourceAction /> : null}
      {selectedResources.ID ? <Elements /> : null}
    </div>
  );
};

export default Resource;
