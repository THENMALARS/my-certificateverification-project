import React, { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const UploadCertificates = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= EXCEL ================= */

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.name.split(".").pop().toLowerCase();

    if (!["xlsx", "xls", "csv"].includes(type)) {
      toast.error("Please upload a valid Excel file");
      return;
    }

    setExcelFile(file);
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();

    if (!excelFile) {
      toast.error("Please select an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    setUploading(true);

    try {
      const res = await axios.post("/certificates/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Excel uploaded successfully!");

      setExcelFile(null);
      document.getElementById("excelInput").value = "";
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">

      {/* ===== EXCEL UPLOAD ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
        }}
      >
        <div className="card">
          <h2 className="card-title">📊 Upload Student Data</h2>

          <div className="alert alert-info">
            <strong>Required Columns:</strong>
            <p style={{ marginTop: "0.5rem" }}>
              Certificate ID | Student Name | Domain | Start Date | End Date
            </p>
          </div>

          <form onSubmit={handleExcelUpload}>
            <div className="upload-area">
              <div className="upload-icon">📄</div>

              <h3>
                {excelFile ? excelFile.name : "Click to upload Excel file"}
              </h3>

              <p>Supported formats: .xlsx, .xls, .csv</p>

              <input
                id="excelInput"
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={handleExcelChange}
              />

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  document.getElementById("excelInput").click()
                }
              >
                Select File
              </button>
            </div>

            {excelFile && (
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Student Data"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ===== INSTRUCTIONS ===== */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <h2 className="card-title">📝 Instructions</h2>

        <ol style={{ paddingLeft: "1.5rem", lineHeight: "2" }}>
          <li>Prepare your Excel file with required columns</li>
          <li>Ensure all Certificate IDs are unique</li>
          <li>Upload student data first</li>
          <li>Certificate file name must match Certificate ID</li>
        </ol>

        <div style={{ marginTop: "1.5rem" }}>
          <a
            href="/sample-certificates.xlsx"
            className="btn btn-secondary"
            download
          >
            📥 Download Sample Excel File
          </a>
        </div>
      </div>

    </div>
  );
};

export default UploadCertificates;