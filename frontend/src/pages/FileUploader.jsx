import React, { useState, useEffect, useRef, useContext } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import { AuthContext } from "../context/AuthContext";
registerPlugin(FilePondPluginFileValidateType);

const FileUploader = () => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [sitename, setSitename] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [sites, setSites] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const pondRef = useRef(null);

  // Fetch Sites
  useEffect(() => {
    const empID = localStorage.getItem("empID");
    fetch("http://localhost:5000/api/sites", {
      headers: { empID }
    })
      .then((res) => res.json())
      .then((data) => setSites(data))
      .catch((err) => {
        console.error("Error fetching sites:", err);
        setSites([]);
      });
  }, []);

  // Fetch Uploaded Files
  const fetchFiles = () => {
    const empID = localStorage.getItem("empID");
    fetch("http://localhost:5000/api/files", {
      headers: { empID }
    })
      .then((res) => res.json())
      .then((data) => setUploadedFiles(data))
      .catch((err) => {
        console.error("Error fetching uploaded files:", err);
        setUploadedFiles([]);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, [fileUrl]);

  const handleSubmit = () => {
    if (!files.length || !sitename.trim()) {
      alert("Please select a site and upload a file.");
      return;
    }
    if (pondRef.current) {
      pondRef.current.processFiles();
    }
  };

  // Delete file
  const handleDelete = async (id, filename) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const empID = localStorage.getItem("empID");
      await fetch(`http://localhost:5000/api/files/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", empID }
      });
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">
          🚫 You don’t have access. Please login to continue.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Upload Form */}
      {user.role !== "client" && user.role !== "superadmin" && (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">📁 File Uploader</h2>

        {/* Site Dropdown */}
        <select
          value={sitename}
          onChange={(e) => setSitename(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        >
          <option value="">Select Site</option>
          {sites.map((site) => (
            <option key={site._id} value={site._id}>
              {site.location}
            </option>
          ))}
        </select>

        {/* FilePond */}
        <FilePond
          ref={pondRef}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          allowProcess={false}
          server={{
            process: (fieldName, file, metadata, load, error, progress) => {
              const formData = new FormData();
              const empID = localStorage.getItem("empID");

              formData.append("file", file);
              formData.append("sitename", sitename);
              formData.append("empID", empID);

              const request = new XMLHttpRequest();
              request.open("POST", "http://localhost:5000/upload");

              request.upload.onprogress = (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
              };

              request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                  const res = JSON.parse(request.responseText);
                  setFileUrl(res.fileUrl);
                  load(res.fileUrl);
                } else {
                  error("Upload failed");
                }
              };

              request.onerror = () => error("Upload failed");
              request.send(formData);

              return { abort: () => request.abort() };
            }
          }}
          name="file"
          labelIdle='📂 Drag & Drop or <span class="filepond--label-action">Browse</span> your file'
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Submit
        </button>
      </div>
      )}

      {/* Uploaded Files Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-4">📦 Uploaded Files</h3>
        {uploadedFiles.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Site</th>
                <th className="border px-4 py-2">File URL</th>
                {user?.role === 'admin' || user?.role === 'developer' && (
                  <th className="border px-4 py-2">Actions</th>
                )}
                
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file) => {
                const site = sites.find((s) => s._id === file.sitename);
                return (
                  <tr key={file._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">
                      {site ? site.location : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {file.fileUrl}
                      </a>
                    </td>
                    {user?.role === 'admin' || user?.role === 'developer' && (
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDelete(file._id, file.filename)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                        Delete
                      </button>
                    </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
