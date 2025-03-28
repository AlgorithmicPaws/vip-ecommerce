const QuestionsActions = ({showQuestionForm, setShowQuestionForm}) => {
  return (
    <div className="questions-actions">
      <button
        className="ask-question-btn"
        onClick={() => setShowQuestionForm(!showQuestionForm)}
      >
        Hacer una pregunta
      </button>
    </div>
  );
};

export default QuestionsActions;
