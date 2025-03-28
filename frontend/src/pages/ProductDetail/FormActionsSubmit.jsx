const FormActionsSubmit = (setShowQuestionForm) => {
  return (
    <div className="form-actions">
      <button
        type="button"
        className="cancel-btn"
        onClick={() => setShowQuestionForm(false)}
      >
        Cancelar
      </button>
      <button type="submit" className="submit-btn">
        Enviar Pregunta
      </button>
    </div>
  );
};

export default FormActionsSubmit;
