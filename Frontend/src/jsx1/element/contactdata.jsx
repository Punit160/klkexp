import avatar1 from "../../assets/images/User.jpg";

function ContactData({ gap }) {

  // Example recent expense creators
  const contactdataa = [
    {
      image: <img className="avatar avatar-lg avatar-circle mb-2" src={avatar1} alt="avatar" />,
      name: "Jordana Niclany",
      email: "jordana@mail.com",
      lastExpense: "₹12,500"
    },
    {
      image: (
        <div className="avatar avatar-label avatar-lg bg-success-light text-success avatar-circle mb-2 mx-auto">
          KD
        </div>
      ),
      name: "Jacob Jack",
      email: "jacob@mail.com",
      lastExpense: "₹7,800"
    },
    {
      image: <img className="avatar avatar-lg avatar-circle mb-2" src={avatar1} alt="avatar" />,
      name: "Sammy Nico",
      email: "sammy@mail.com",
      lastExpense: "₹15,200",
      class: "bg-purple-light"
    },
    {
      image: <img className="avatar avatar-lg avatar-circle mb-2" src={avatar1} alt="avatar" />,
      name: "Gibs Gibsy",
      email: "gibs@mail.com",
      lastExpense: "₹5,900",
      class: "bg-cream-light"
    },
    {
      image: <img className="avatar avatar-lg avatar-circle mb-2" src={avatar1} alt="avatar" />,
      name: "Sam Sammy",
      email: "sam@mail.com",
      lastExpense: "₹10,400"
    },
    {
      image: <img className="avatar avatar-lg avatar-circle mb-2" src={avatar1} alt="avatar" />,
      name: "Corey Core",
      email: "corey@mail.com",
      lastExpense: "₹8,700"
    }
  ];

  return (
    <>
      <div className="card-body">
        <div className={`row ${gap}`}>
          {contactdataa.map((data, i) => (
            <div className="col-xl-4 col-sm-4 col-6" key={i}>
              <div className={`avatar-card text-center border-dashed rounded px-2 py-3 ${data.class || ""}`}>
                {data.image}
                <h6 className="mb-0">{data.name}</h6>
                <span className="fs-12">{data.email}</span>
                <div className="fs-12 text-muted">Last Expense: {data.lastExpense}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ContactData;