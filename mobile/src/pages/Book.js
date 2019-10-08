import React, { useState, useEffect } from "react";

import {
  Alert,
  SafeAreaView,
  AsyncStorage,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";

import api from "../services/api";
import logo from "../assets/logo.png";

export default function Book({ navigation }) {
  const [spot, setSpot] = useState(null);
  const [spotId, setSpotId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const id = navigation.getParam("id");
    setSpotId(id);

    async function loadSpot() {
      const resp = await api.get("/spots", {
        params: { spot_id: id }
      });
      setSpots(resp.data);
    }

    //loadSpot();
  }, []);

  async function handleSubmit() {
    const user_id = await AsyncStorage.getItem("user");

    await api.post(
      `/spots/${spotId}/bookings`,
      { date },
      { headers: { user_id } }
    );

    Alert.alert("Reserva realizada com sucesso!");

    navigation.navigate("List");
  }
  function handleCancel() {
    navigation.navigate("List");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.form}>
        <Text style={styles.label}>DATA DE INTERESSE *</Text>
        <TextInput
          style={styles.input}
          placeholder="Qual a data quer reservar?"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setDate}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Reservar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={styles.buttonCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 10
  },
  form: {
    alignSelf: "stretch",
    paddingHorizontal: 30,
    marginTop: 30
  },
  label: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 20,
    fontSize: 26,
    color: "#444",
    height: 44,
    marginBottom: 20,
    borderRadius: 2
  },
  button: {
    height: 42,
    backgroundColor: "#f05a5b",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  buttonCancel: {
    height: 42,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});
