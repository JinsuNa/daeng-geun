"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/MarketItem.css"; // 스타일 추가

function MarketItemPage() {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const productId = Number(id);
  const navigate = useNavigate();

  // 상태 관리
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // 댓글 관리
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/market-comments/${productId}`
        );
        console.log("📦 댓글 응답 데이터:", res.data, typeof res.data);

        const parsedData =
          typeof res.data === "string" ? JSON.parse(res.data) : res.data;

        setComments(parsedData); // ✅ 확실하게 배열로 세팅
      } catch (error) {
        console.error("❌ 댓글 불러오기 실패:", error);
      }
    };

    if (productId) fetchComments();
  }, [productId]);
  //댓글 작성 함수
  const handleAddComment = async () => {
    const userId = localStorage.getItem("userId");
    const content = newComment.trim();

    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!content) return;

    try {
      await axios.post("http://localhost:8080/api/market-comments", {
        productId,
        userId: Number(userId),
        content,
      });

      setNewComment("");

      const res = await axios.get(
        `http://localhost:8080/api/market-comments/${productId}`
      );

      let parsed = res.data;
      if (typeof res.data === "string") {
        try {
          parsed = JSON.parse(res.data); // 여기서 실패하면 catch로 넘어감
        } catch (jsonError) {
          console.error("❌ JSON 파싱 실패:", jsonError);
          alert("서버로부터 잘못된 댓글 응답이 왔습니다.");
          return;
        }
      }

      setComments(parsed);
    } catch (error) {
      console.error("❌ 댓글 불러오기 실패:", error);
    }
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (commentId) => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
  
    try {
      // ✅ 댓글 삭제 API 호출로 수정
      await axios.delete(`http://localhost:8080/api/market-comments/${commentId}`, {
        params: { userId: Number(userId) },
      });
  
      // 삭제된 댓글만 제거
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("❌ 댓글 삭제 실패:", err);
      alert("본인 댓글만 삭제할 수 있습니다.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || isNaN(productId)) {
        setError("유효하지 않은 상품 ID입니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log(`Fetching product with ID: ${productId}`);

        const response = await axios.get(
          `http://localhost:8080/api/products/${productId}`
        );

        setProduct(response.data);
      } catch (err) {
        console.error("❌ 상품 데이터 가져오기 실패:", err);
        setError("상품 정보를 찾을 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return price.toLocaleString() + "원";
  };

  // 채팅하기 버튼 클릭 핸들러
  const handleChatClick = () => {
    if (product?.sellerName) {
      navigate(`/chat?seller=${product.sellerName}`);
    }
  };

  // 로딩 중 화면
  if (isLoading) {
    return <div className="loading">⏳ 상품 정보를 불러오는 중...</div>;
  }

  // 에러 발생 시 화면
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button className="btn-primary" onClick={() => navigate("/market")}>
          🔙 목록으로 돌아가기
        </button>
      </div>
    );
  }
  // ✅ 게시글 삭제 함수
  const handleDelete = async () => {
    const userId = localStorage.getItem("userId"); // ✅ 로그인된 사용자 ID 가져오기
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return; // ✅ 삭제 확인창

    try {
      await axios.delete(`http://localhost:8080/api/products/${product.id}`, {
        params: { userId },
      });

      alert("✅ 게시글이 삭제되었습니다.");
      navigate("/market"); // ✅ 삭제 후 목록 페이지로 이동
    } catch (error) {
      console.error("❌ 게시글 삭제 실패:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";

    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24시간 형식
    });
  };

  return (
    <div className="market-item-container">
      {/* 상품 이미지 섹션 */}
      <div className="image-container">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="product-detail-image"
        />
      </div>

      {/* 상품 상세 정보 */}
      <div className="product-details">
        {/* 위치 및 등록일 */}
        <div className="product-meta">
          <p>📍 위치: {product.location || "위치 정보 없음"}</p>
          <p>👀 조회수: {product.views}</p>
          <p>🕒 등록일: {formatDate(product.createdAt)}</p>
          {product.updatedAt && product.updatedAt !== product.createdAt && (
            <p>✏️ 수정일: {formatDate(product.updatedAt)}</p>
          )}
        </div>

        {/* 판매자 정보 */}
        <div className="seller-info">
          <img
            src={product.sellerImage || "/placeholder.svg"}
            alt="판매자 아바타"
            className="seller-avatar"
          />
          <div className="seller-text">
            <p className="seller-name">
              👤 {product.sellerNickname || "알 수 없음"}
            </p>
          </div>
        </div>
        <h1 className="product-title">{product.title}</h1>
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className="product-description">{product.description}</p>

        {/* 버튼 그룹 */}
        <div className="button-group">
          <button className="btn-secondary" onClick={() => navigate("/market")}>
            🔙 목록으로
          </button>
          <button
            className="btn-edit"
            onClick={() => navigate(`/market/edit/${product.id}`)}
          >
            ✏️ 수정하기
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            🗑️ 삭제하기
          </button>
        </div>
      </div>
      {/* ✅ 댓글 섹션 */}
      <div className="comments-section">
        <h2>💬 댓글</h2>
        <div className="comment-input">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <button className="btn-primary" onClick={handleAddComment}>
            등록
          </button>
        </div>
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.nickname}</strong> 🕒{" "}
                {formatDate(comment.createdAt)}
              </div>
              <div className="comment-content">{comment.content}</div>
              {comment.userId.toString() === localStorage.getItem("userId") && (
                <button
                  className="btn-delete-small"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MarketItemPage;
