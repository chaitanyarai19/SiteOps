import React, { useState, useEffect } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";

registerPlugin(FilePondPluginFileValidateType);

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [sitename, setSitename] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [sites, setSites] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch site list
  useEffect(() => {
    fetch("http://localhost:5000/api/sites",{method:"GET",credentials: 'include'})
      .then((res) => res.json())
      .then((data) => setSites(data))
      .catch((err) => {
        console.error("Error fetching sites:", err);
        setSites([]);
      });
  }, []);

  // Fetch uploaded files
  useEffect(() => {
    fetch("http://localhost:5000/api/files",{method:"GET",credentials: 'include'})
      .then((res) => res.json())
      .then((data) => setUploadedFiles(data))
      .catch((err) => {
        console.error("Error fetching uploaded files:", err);
        setUploadedFiles([]);
      });
  }, [fileUrl]); // re-fetch on new upload

  const handleSubmit = () => {
    if (!files.length || !sitename.trim()) {
      alert("Please select a site and upload a file.");
      return;
    }

    alert("File submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">📁 File Uploader</h2>

        <select
          value={sitename}
          onChange={(e) => setSitename(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Site</option>
          {sites.map((site) => (
            <option key={site._id} value={site._id}>
              {site.location}
            </option>
          ))}
        </select>

        <FilePond
          files={files}
          onupdatefiles={setFiles}
          name="file"
          allowMultiple={false}
          server={{
            process: (fieldName, file, metadata, load, error, progress, abort) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("sitename", sitename);

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

              request.send(formData);
              return {
                abort: () => request.abort(),
              };
            },
          }}
          labelIdle='📂 Drag & Drop or <span class="filepond--label-action">Browse</span> your file'
          className="mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg"
        >
          Submit
        </button>

        {fileUrl && (
          <div className="mt-4 text-green-700 font-semibold">
            ✅ Uploaded:{" "}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {fileUrl}
            </a>
          </div>
        )}
      </div>

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
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">
                    {file.sitename || file.sitename || "N/A"}
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
