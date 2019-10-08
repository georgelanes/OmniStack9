import React, { useState, useMemo } from "react";
import camera from "../../assets/camera.svg";
import styles from "./styles.css";
import api from "../../services/api";

export default function New({ history }) {
  const [company, setCompany] = useState("");
  const [techs, setTechs] = useState("");
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    const user_id = localStorage.getItem("user");
    data.append("thumbnail", thumbnail);
    data.append("company", company);
    data.append("techs", techs);
    data.append("price", price);

    const resp = await api.post("/spots", data, {
      headers: { user_id }
    });

    console.log(resp);

    history.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label
        className={thumbnail ? "has-thumbnail" : ""}
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
      >
        <input
          type="file"
          onChange={event => setThumbnail(event.target.files[0])}
        />
        <img src={camera} alt="select img" />
      </label>

      <label>EMPRESA *</label>
      <input
        type="text"
        id="company"
        placeholder="Sua empresa"
        onChange={event => setCompany(event.target.value)}
        value={company}
      />
      <label>
        TECNOLOGIAS * <span>(separadas por virgulas)</span>
      </label>
      <input
        type="text"
        id="techs"
        placeholder="tecnologias"
        onChange={event => setTechs(event.target.value)}
        value={techs}
      />

      <label>PREÇO *</label>
      <input
        type="text"
        id="price"
        placeholder="0,00"
        onChange={event => setPrice(event.target.value)}
        value={price}
      />

      <button className="btn">Salvar</button>
    </form>
  );
}
