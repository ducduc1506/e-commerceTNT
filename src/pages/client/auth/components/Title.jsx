const Title = ({ tileForm, question, link, nameLink }) => {
  return (
    <>
      <h1 className="text-[30px] font-medium">{tileForm}</h1>
      <p className="text-gray-500">
        {question}{" "}
        <a className="text-black font-medium hover:text-gray-700" href={link}>
          {nameLink}
        </a>
      </p>
    </>
  );
};

export default Title;
