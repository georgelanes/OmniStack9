import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import socketio from "socket.io-client";

import api from "../../services/api";
import styles from "./styles.css";

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [requests, setRequests] = useState([]);

  const user_id = localStorage.getItem("user");

  const socket = useMemo(
    () =>
      socketio("http://localhost:3333", {
        query: { user_id }
      }),
    [user_id]
  );

  useEffect(() => {
    socket.on("booking_request", data => {
      console.log(data);
      setRequests([...requests, data]);
    });
  }, [requests, socket]);

  useEffect(() => {
    const user_id = localStorage.getItem("user");
    async function loadSpots() {
      const resp = await api.get("/dashboard", {
        headers: { user_id }
      });
      setSpots(resp.data);
    }

    loadSpots();
  }, []);

  async function handleAcccept(id) {
    console.log(id);
    await api.post(`/bookings/${id}/approvals`, {});
    setRequests(requests.filter(request => request._id !== id));
  }

  async function handleReject(id) {
    await api.post(`/bookings/${id}/rejections`);
    setRequests(requests.filter(request => request._id !== id));
  }

  return (
    <>
      <ul className="notifications">
        {requests.map(req => (
          <li key={req._id}>
            <p>
              <strong>{req.user.email}</strong> está solicitando uma reserva em{" "}
              <strong>{req.spot.company}</strong> para a data{" "}
              <strong>{req.date} </strong>
            </p>
            <button onClick={() => handleAcccept(req._id)} className="accept">
              ACEITAR
            </button>
            <button onClick={() => handleReject(req._id)} className="reject">
              REJEITAR
            </button>
          </li>
        ))}
      </ul>
      <ul className="spot-list">
        {spots.map(spot => (
          <li key={spot._id}>
            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
            <strong>{spot.company}</strong>
            <span>{spot.price ? `R$ ${spot.price} / dia` : "Gratuito"}</span>
          </li>
        ))}
      </ul>
      <Link to="/new">
        <button className="btn">Cadastrar novo spot</button>
      </Link>
    </>
  );
}
