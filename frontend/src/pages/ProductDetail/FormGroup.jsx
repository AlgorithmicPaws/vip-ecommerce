const FormGroup = ({questionForm, setQuestionForm}) => {
  return (
    <div className="form-group">
      <label>Nombre</label>
      <input
        type="text"
        value={questionForm.name}
        onChange={(e) =>
          setQuestionForm({ ...questionForm, name: e.target.value })
        }
        required
      />
    </div>
  );
};

export default FormGroup;
