const TabsHeader = ({questions, activeTab, reviews, setActiveTab}) => {
  return (
    <div className="tabs-header">
      <button
        className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
        onClick={() => setActiveTab("description")}
      >
        Descripción
      </button>
      <button
        className={`tab-btn ${activeTab === "specifications" ? "active" : ""}`}
        onClick={() => setActiveTab("specifications")}
      >
        Especificaciones
      </button>
      <button
        className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
        onClick={() => setActiveTab("reviews")}
      >
        Reseñas ({reviews.length})
      </button>
      <button
        className={`tab-btn ${activeTab === "questions" ? "active" : ""}`}
        onClick={() => setActiveTab("questions")}
      >
        Preguntas ({questions.length})
      </button>
    </div>
  );
};

export default TabsHeader;
