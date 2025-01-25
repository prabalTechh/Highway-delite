import { useEffect, useState } from "react";
import logo from "../assets/icon.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Notes from "../components/Notes";

interface FormDataProps {
  title: string;
  content: string;
}
interface typeNotes {
  id: string;
  title: string;
  content: string;
}
const BASE_URL = "http://localhost:4000/api/posts";
const BASE_URL_USER = "http://localhost:4000/api/user";

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataProps>({
    title: "",
    content: "",
  });
  const [notes, setNote] = useState<typeNotes[]>([]);
  const [userData, setUserData] = useState<any>({});
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();

  useEffect(() => {
    const getNotesData = async () => {
      const { data } = await axios.get(`${BASE_URL}/notes`, {
        headers: {
          Authorization: token,
        },
      });
      const notesData = (data as any).data;
      setNote(notesData);
    };
    getNotesData();
  }, [token]);


  useEffect(() => {
    const getUserData = async () => {
      const { data } = await axios.get(`${BASE_URL_USER}/profile`, {
        headers: {
          Authorization: token,
        },
      });
      const userData = (data as any).data
      setUserData(userData);
      // setUserData(notesData);
    };
    getUserData();
  }, [token]);



  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/notes/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setNote((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Failed to delete note", error);
      alert("Failed to delete note. Please try again.");
    }
  };

  const handleEditNote = (id: string, title: string, content: string) => {
    setFormData({ title, content });
    setCurrentNoteId(id);
    setIsEditing(true);
    setIsVisible(true);
  };

  const handleUpdateNote = async () => {
    if (!currentNoteId) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/notes/${currentNoteId}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        setNote((prevNotes) =>
          prevNotes.map((note) =>
            note.id === currentNoteId ? { ...note, ...formData } : note
          )
        );

        setIsEditing(false);
        setCurrentNoteId(null);
        setIsVisible(false);
        setFormData({ title: "", content: "" });
      } else {
        alert("Failed to update note");
      }
    } catch (error) {
      console.error("Failed to update note", error);
      alert("Failed to update note. Please try again.");
    }
  };

  const handleButtonClick = () => {
    setIsVisible(!isVisible);

    if (!isVisible) {
      setFormData({ title: "", content: "" });
      setIsEditing(false);
      setCurrentNoteId(null);
    }
  };

  const handleInputChange = (field: keyof FormDataProps, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleApiAddNotes = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/notes`, formData, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 201) {
        setNote((prevNotes) => [...prevNotes, (response.data as any).data]);
        setFormData({ title: "", content: "" });
        setIsVisible(false);
      } else {
        alert("Failed to add note");
      }
    } catch (error) {
      console.error("Failed to add note", error);
      alert("Failed to add note. Please try again.");
    }
  };

  const handleAddNote = () => {
    if (formData.title.trim() && formData.content.trim()) {
      handleApiAddNotes();
    } else {
      alert("Both title and description are required!");
    }
  };

  return (
    <div className="h-screen w-screen">
      <div className="flex justify-between items-center px-5 py-2">
        <img src={logo} alt="logo" />
        <h1>Dashboard</h1>
        <button
          className="underline text-blue-400"
          onClick={() => {
            localStorage.removeItem("token");
            Navigate("/login");
          }}
        >
          Sign Out
        </button>
      </div>

      <div className="w-full">
        <div className="border border-gray-300 px-5 py-4 m-5">
          <h1 className="text-xl font-semibold ">Welcome, <span className="font-bold">{userData.name}</span></h1>
          <h2 className="font-light">{userData.email}</h2>
        </div>
      </div>

      <div className="w-full">
        <div className="border border-gray-300 px-5 py-4 gap-4 m-5">
          <div className="flex justify-between items-center px-1 text-sm lg:text-base lg:px-8">
            <h1>NOTES</h1>
            <button
              onClick={handleButtonClick}
              className="px-5 py-1 border border-gray-300 font-semibold rounded-xl"
            >
              {isEditing ? "Cancel Edit" : "Add Notes"}
            </button>
          </div>

          {isVisible && (
            <div className="absolute flex items-center justify-center left-0 top-0 h-screen w-screen bg-black/20">
              <div className="bg-white flex flex-col gap-1 md:gap-4 rounded-xl min-w-xxs sm:min-w-xl p-5">
                <div className="flex justify-end">
                  <button
                    onClick={handleButtonClick}
                    className="border border-gray-300 py-1 px-2 rounded"
                  >
                    X
                  </button>
                </div>

                <textarea
                  placeholder="TITLE"
                  className="w-full placeholder:text-2xl placeholder-gray-400 focus:placeholder-transparent p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-28 resize-none"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                ></textarea>

                <textarea
                  placeholder="DESCRIPTION"
                  className="w-full placeholder:text-2xl placeholder-gray-400 focus:placeholder-transparent p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 resize-none"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                ></textarea>

                <div className="flex justify-end">
                  <button
                    className="border border-gray-400 px-5 py-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onClick={isEditing ? handleUpdateNote : handleAddNote}
                  >
                    {isEditing ? "Update Note" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isVisible && (
            <div className="w-full flex flex-col rounded-lg">
              {notes.map((note) => (
                <Notes
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  onClick1={() => handleEditNote(note.id, note.title, note.content)}
                  onClick2={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
