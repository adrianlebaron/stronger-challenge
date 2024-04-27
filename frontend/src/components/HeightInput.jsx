
const HeightInput = ({setValue, value, name = '', className = '', id = '', placeholder = "5'11", required=false}) => {
  const onChange = (e) => {
    let newValue = e.target.value;
    const currHeight = value;

    newValue = String(newValue).replace(/[^0-9']/g, '');
    //if has repeated single quote ' remove one
    if (newValue.endsWith("''")) {
      newValue = newValue.substring(0, newValue.length - 1)
    }

    //if a character is deleted
    if (newValue.length < currHeight.length) {
      let charsToRemove = 1;
      if (currHeight.endsWith("'")) {
          charsToRemove = 2;
      }

      setValue(currHeight.substring(0, currHeight.length - charsToRemove));
      return true;
    }

    //if it's already 4 characters long, don't allow any more input
    if (currHeight.length === 4) {
        return false;
    }

    if (newValue.length === 1) {
      newValue += "'";
    }

    if (newValue.length === 4) {
      const splited = newValue.split("'");
      if (splited[1] > 11) {
        newValue = splited[0] + "'" + "11";
      }
    }

    setValue(newValue);
  }

  return (
    <input
      type="text"
      name={name}
      className={className}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  )
}

export default HeightInput;
