"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// import "../styles/Community.css"

function MarketWritePage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    images: [],
  })
  const [previewImages, setPreviewImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [file, setFile] = useState(null);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);


  


  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId")
    const data = new FormData()
    data.append("product", new Blob([JSON.stringify({ ...formData, sellerId: userId })], { type: "application/json" }));
    if (file) data.append("image", file);

    await axios.post("http://localhost:8080/api/products", data, { headers: { "Content-Type": "multipart/form-data" } });
  };
  



  return (
    <div className="market-write-container">
      <h1>상품 등록</h1>
      {error && <p className="error-message">{error}</p>}

      <label>제목</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} />

      <label>가격</label>
      <input type="number" name="price" value={formData.price} onChange={handleChange} />

      <label>설명</label>
      <textarea name="description" value={formData.description} onChange={handleChange} />

      <label>이미지 업로드 (최대 5개)</label>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <div className="image-preview-container">
        {previewImages.map((img, index) => (
          <img key={index} src={img} alt={`미리보기-${index}`} className="image-preview" />
        ))}
      </div>

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "등록 중..." : "상품 등록"}
      </button>
    </div>
  )
}




export default MarketWritePage

