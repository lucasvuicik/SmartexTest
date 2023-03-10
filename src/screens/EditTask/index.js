import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Appbar, useTheme, Checkbox } from "react-native-paper";

import { AnimatedModal, CircleButton, CustomTextInput } from "../../components";
import { styles as s } from "./styles";

export const EditTask = () => {
  const dataKey = "@smartex-test-app:tasks";

  const navigation = useNavigation();
  const route = useRoute();
  const { colors, fontSize } = useTheme();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [task, setTask] = useState({});
  const [check, setCheck] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const resetInputs = () => {
    setTitle("");
    setDesc("");
  };

  const handleDeleteTask = async (item) => {
    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const newData = currentData.filter((item) => item.id !== task.id);

      if (!newData.length) {
        await AsyncStorage.removeItem(dataKey);
        navigation.navigate("TasksList", {
          tasks: [],
        });
        return;
      }

      await AsyncStorage.setItem(dataKey, JSON.stringify(newData));
      resetInputs();
      navigation.navigate("TasksList", {
        tasks: newData,
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Nao foi possivel editar!");
    }
  };

  const handleEditTask = async (task) => {
    const editedTask = {
      ...task,
      title,
      desc,
      isChecked: check,
    };

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const newData = currentData.map((item) => {
        if (item.id === task.id) {
          return editedTask;
        }
        return item;
      });

      await AsyncStorage.setItem(dataKey, JSON.stringify(newData));
      resetInputs();
      navigation.navigate("TasksList", {
        tasks: newData,
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Nao foi editar salvar!");
    }
  };

  useEffect(() => {
    if (route.params?.selectedTask) {
      setTask(route.params?.selectedTask);
      setTitle(route.params?.selectedTask.title);
      setDesc(route.params?.selectedTask.desc);
      setCheck(route.params?.selectedTask.isChecked);
    }
  }, [route.params]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.container}
      >
        <Appbar.Header mode="small" style={{ backgroundColor: colors.blue }}>
          <Appbar.Action
            icon="arrow-left"
            color="#FFF"
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content color="#FFF" title="Editar tarefa" />
          <Appbar.Action
            icon="delete"
            color="#FFF"
            onPress={() => setIsModalVisible(true)}
          />
        </Appbar.Header>

        <View style={s.elementsContainer}>
          <CustomTextInput
            label="Titulo"
            value={title}
            onChangeText={(txt) => setTitle(txt)}
            style={{ fontSize: fontSize.big }}
            maxLength={50}
          />
          <CustomTextInput
            label="Descricao"
            value={desc}
            onChangeText={(txt) => setDesc(txt)}
            style={{ fontSize: fontSize.medium }}
            multiline={true}
          />

          <View style={s.checkboxContainer}>
            <Checkbox
              status={check ? "checked" : "unchecked"}
              onPress={() => setCheck(!check)}
              uncheckedColor={colors.red}
              color={colors.orange}
            />

            <Text style={s.checkboxText}>Tarefa completada?</Text>
          </View>
        </View>

        <CircleButton icon="check" onPress={() => handleEditTask(task)} />

        <AnimatedModal
          show={isModalVisible}
          deleteConfirmation={() => {
            handleDeleteTask(task);
            setIsModalVisible(false);
          }}
          closeOnPress={() => {
            setIsModalVisible(false);
          }}
          label="Deseja realmente excluir a tarefa?"
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
