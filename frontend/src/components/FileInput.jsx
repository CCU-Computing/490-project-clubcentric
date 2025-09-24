import React, { useState } from "react";

export default function FileInput() 
{
  const [file, setFile] = useState(null);

  const handleChange = (event) => 
  {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => 
  {
    if (file) {
      console.log("File selected:", file.name);
      // TODO: Replace with your actual upload logic (API call, etc.)
    } else {
      console.log("No file selected");
    }
  };

  // console.log("API_URL is:", import.meta.env.VITE_API_URL);

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}