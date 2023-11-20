import {
  ArchiveBoxIcon,
  PencilIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
const ListItem = ({
  children,
  onClick,
  selected,
  handleDelete,
  handleEdit,
}: any) => {
  return (
    <div
      className={`relative rounded ${
        selected ? "border-2 border-indigo-600" : "border-2 border-gray-200"
      }  bg-white px-4 py-3 my-3 sm:px-6 w-80`}
    >
      {onClick ? (
        <ChevronRightIcon
          className="h-6 w-6 absolute right-0 mr-5 text-indigo-600 font-bold cursor-pointer"
          aria-hidden="true"
          onClick={onClick}
        />
      ) : null}
      {children}
      <div className="flex p-2 justify-end">
        {handleDelete ? (
          <ArchiveBoxIcon
            className="h-6 w-6 cursor-pointer"
            aria-hidden="true"
            onClick={handleDelete}
          />
        ) : null}
        {handleEdit ? (
          <PencilIcon
            className="h-6 w-6 ml-3 cursor-pointer"
            aria-hidden="true"
            onClick={handleEdit}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ListItem;
