import React, { useState } from 'react';
import './InsertDocument.css';
// import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InsertDocument = () => {
  const [formData, setFormData] = useState({
    author: '',
    advisor: '',
    etd_file_id: '',
    year: '',
    university: '',
    degree: '',
    program: '',
    text: '',
    file: null,
  });
  const [uploaded, setUploaded] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost:5000/v1/insertDocumnet', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploaded(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container">
      {uploaded ? "document uploaded" : ""}
      <div className="form-container-wrap">
        <form onSubmit={handleSubmit}>
          <label>
            Author:
            <input type="text" name="author" value={formData.author} onChange={handleChange} />
          </label>
          <label>
            Advisor:
            <input type="text" name="advisor" value={formData.advisor} onChange={handleChange} />
          </label>
          <label>
            ETDID:
            <input type="text" name="etd_file_id" value={formData.etd_file_id} onChange={handleChange} />
          </label>
          <label>
            Year:
            <input type="text" name="year" value={formData.year} onChange={handleChange} />
          </label>
          <label>
            University:
            <input type="text" name="university" value={formData.university} onChange={handleChange} />
          </label>
          <label>
            Degree:
            <input type="text" name="degree" value={formData.degree} onChange={handleChange} />
          </label>
          <label>
            Program:
            <input type="text" name="program" value={formData.program} onChange={handleChange} />
          </label>
          <label>
            Abstract:
            <textarea name="text" value={formData.text} onChange={handleChange}></textarea>
          </label>
          <label>
            Upload PDF:
            <input type="file" name="pdfFile" onChange={handleFileChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default InsertDocument;
