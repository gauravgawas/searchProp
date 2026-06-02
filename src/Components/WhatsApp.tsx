import whatsappicon from "../assets/whatsapp.png";
const WhatsApp = ({ phoneNumber }: { phoneNumber: number }) => {
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1ebe57")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#25D366")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 20px",
        background: "#25D366",
        color: "#fff",
        fontSize: "15px",
        fontWeight: 500,
        borderRadius: "8px",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <img
        src={whatsappicon}
        alt=""
        style={{ width: "20px", height: "20px" }}
      />
      Ping on WhatsApp
    </a>
  );
};

export default WhatsApp;
