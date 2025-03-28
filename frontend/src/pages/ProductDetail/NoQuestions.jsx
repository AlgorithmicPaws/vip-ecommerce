const NoQuestions = ({setShowQuestionForm}) => {
  return (
    <div className="no-questions">
      <p>Aún no hay preguntas sobre este producto.</p>
      <button
        className="ask-question-btn"
        onClick={() => setShowQuestionForm(true)}
      >
        Sé el primero en hacer una pregunta
      </button>
    </div>
  );
};

export default NoQuestions;
