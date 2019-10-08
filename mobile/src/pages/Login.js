import React, { useState, useEffect } from "react";

import {
  AsyncStorage,
  View,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";

import logo from "../assets/logo.png";
import api from "../services/api";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [techs, setTechs] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        navigation.navigate("List");
      }
    });
  });

  async function handleSubmit() {
    const resp = await api.post("/sessions", {
      email
    });

    const { _id } = resp.data;

    await AsyncStorage.setItem("user", _id);
    await AsyncStorage.setItem("techs", techs);

    navigation.navigate("List");
  }

  return (
    <KeyboardAvoidingView
      enabled={Platform.OS == "ios"}
      behavior="padding"
      style={styles.container}
    >
      <Image source={logo} />
      <View style={styles.form}>
        <Text style={styles.label}>SEU E-MAIL *</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe seu e-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>TECNOLOGIAS *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tecnologias de interesse"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Encontrar Spots</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8
  },
  form: {
    alignSelf: "stretch",
    paddingHorizontal: 30,
    marginTop: 30
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
    alignItems: "center"
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  }
});
