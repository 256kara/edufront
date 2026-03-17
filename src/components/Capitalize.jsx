const capusername = (uname) => {
  if (!uname) return ""; // Handle empty or null strings
  return uname.charAt(0).toUpperCase() + uname.slice(1);
};

export default capusername;
