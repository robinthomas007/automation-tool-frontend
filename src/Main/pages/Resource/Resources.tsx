import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  closeModal,
  openModal,
  modalSelector,
} from "../../../redux/Slice/commonModalSlice";
import Modal from "../../../Components/Modal";

const Resources = () => {
  const modal = useAppSelector(modalSelector);
  const dispatch = useAppDispatch();
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 w-96">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Resources
          </h3>
        </div>
        <div className="ml-4 mt-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              dispatch(openModal({ key: "resource", open: true }));
            }}
            className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Resource
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resources;
