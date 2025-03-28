const Questioncontent = ({question}) => {
  return (
    <div className="question-content">
      <div className="question-header">
        <div className="question-icon">P:</div>
        <div className="question-text">{question.question}</div>
      </div>
      <div className="question-meta">
        Preguntado por {question.author} - {question.date}
      </div>
    </div>
  );
};

export default Questioncontent;
