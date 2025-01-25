import DeleteSvg from "../assets/DeleteSvg";
import EditSvg from "../assets/EditSvg";

interface NotesProps {
  title: string;
  content: string;
  id: string; // Add id to identify each note
  onClick1: (id: string) => void; // Edit handler
  onClick2: (id: string) => void; // Delete handler
}

const Notes = ({ title, content, id, onClick1, onClick2 }: NotesProps) => {
  return (
    <div className="border border-gray-300 p-2 m-2 rounded-2xl">
      <div className="px-8 shadow rounded-xl flex justify-between items-center">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex gap-1 lg:gap-4 items-center justify-center py-1">
          <button
            className="p-1 lg:p-3 shadow rounded-4xl"
            onClick={() => onClick1(id)} // Pass the id to the onClick1 handler
          >
            <EditSvg />
          </button>
          <button
            className="p-1 lg:p-3 shadow rounded-4xl"
            onClick={() => onClick2(id)} // Pass the id to the onClick2 handler
          >
            <DeleteSvg />
          </button>
        </div>
      </div>
      <div className="max-w-screen-lg px-14 text-sm text-left mx-auto py-4">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Notes;
