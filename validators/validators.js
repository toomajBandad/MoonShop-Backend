const emailValidator = (v) => {
      //validate email to include @ letter and correct format
  return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
};

const passwordValidator = (v) => {
  //validate password to include capitals letters and numbers and signs
  return /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/.test(v);
};

module.exports = {
  emailValidator,
  passwordValidator,
};
