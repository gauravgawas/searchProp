import whatsappicon from "../assets/whatsapp.png"
const WhatsApp= ({phoneNumber}: {phoneNumber: number}) => {


  return (
    <a
  href={`https://wa.me/${phoneNumber}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src={whatsappicon}
    alt="WhatsApp Icon"
    className="popout-icon"
    style={{
      marginTop: "10px",
      width: "2rem",
      height: "2rem",
      cursor: "pointer",
    }}
  />
</a>
  );
};

export default WhatsApp;
