const FormGroupQuestion = ({questionForm, setQuestionForm}) => {
  return (
    <div className="form-group">
      <label>Tu pregunta</label>
      <textarea
        rows="4"
        value={questionForm.question}
        onChange={(e) =>
          setQuestionForm({ ...questionForm, question: e.target.value })
        }
        required
      ></textarea>
    </div>
  );
};

export default FormGroupQuestion;
