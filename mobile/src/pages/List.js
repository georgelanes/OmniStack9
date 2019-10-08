import React, { useState, useEffect } from "react";
import socketio from "socket.io-client";
import {
  Alert,
  AsyncStorage,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";

import logo from "../assets/logo.png";
import api from "../services/api";

import SpotList from "../components/SpotList";

export default function List() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("user").then(user_id => {
      const socket = socketio("http://192.168.15.242:3333", {
        query: { user_id }
      });
      socket.on("booking_response", booking => {
        Alert.alert(
          `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${
            booking.approved ? "APROVADA." : "REJEITADA."
          }`
        );
      });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("techs").then(techsList => {
      const techsArray = techsList.split(",").map(tech => tech.trim());
      setTechs(techsArray);
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <ScrollView>
        {techs ? (
          techs.map(tech => <SpotList key={tech} tech={tech} />)
        ) : (
          <Text />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 10
  }
});
