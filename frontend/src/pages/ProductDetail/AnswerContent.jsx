const AnswerContent = ({question}) => {
  return (
    <div className="answer-content">
      <div className="answer-header">
        <div className="answer-icon">R:</div>
        <div className="answer-text">{question.answer}</div>
      </div>
      <div className="answer-meta">
        Respondido por {question.answeredBy} - {question.answerDate}
      </div>
    </div>
  );
};

export default AnswerContent;
