const FormGroupEmail = ({questionForm, setQuestionForm}) => {
  return (
    <div className="form-group">
      <label>Email</label>
      <input
        type="email"
        value={questionForm.email}
        onChange={(e) =>
          setQuestionForm({ ...questionForm, email: e.target.value })
        }
        required
      />
    </div>
  );
};

export default FormGroupEmail;
