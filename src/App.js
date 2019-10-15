import React, {useState, useEffect} from 'react';
import PlusIcon from './src/assets/plus_icon.png';
import {SwipeRow} from 'react-native-swipe-list-view';

import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

export default function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodoList();
  }, []);

  async function getTodoList() {
    try {
      let todoList = (await AsyncStorage.getItem('todoList')) || [];
      if (todoList !== []) todoList = JSON.parse(todoList);
      console.log(todoList);
      setTodos(todoList);
    } catch (error) {
      console.log(error);
    }
  }

  const addTodo = () => {
    if (todo) {
      let newTodoList = todos;
      newTodoList.push(todo);
      setTodo('');
      saveTodoList(newTodoList);
      setTodos(newTodoList);
    }
  };

  const saveTodoList = async todoList => {
    let newTodoList = todoList;
    await AsyncStorage.setItem('todoList', JSON.stringify(newTodoList));
    newTodoList = await AsyncStorage.getItem('todoList');
    newTodoList = JSON.parse(newTodoList);
  };

  return (
    <>
      <StatusBar
        barStyle="white-content"
        hidden={false}
        backgroundColor="#000"
      />
      <SafeAreaView style={styles.appContainer}>
        <ScrollView>
          <View style={styles.addContainer}>
            <TextInput
              style={styles.todoInput}
              placeholder="Add task"
              autoCorrect={false}
              multiline={true}
              value={todo}
              onChangeText={text => setTodo(text)}
            />
            <TouchableOpacity onPress={addTodo} style={styles.addButton}>
              <Image style={styles.plusImage} source={PlusIcon} />
            </TouchableOpacity>
          </View>
          <View>
            {todos &&
              todos.map((todo, index) => (
                <SwipeRow
                  key={index}
                  disableLeftSwipe
                  leftOpenValue={75}
                  closeOnRowPress>
                  <TouchableOpacity
                    onPress={() => {
                      let newTodoList = [];
                      for (let i = 0; i < todos.length; i++) {
                        if (i !== index) {
                          newTodoList.push(todos[i]);
                        }
                      }
                      saveTodoList(newTodoList);
                      setTodos(newTodoList);
                    }}
                    style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Delete ?</Text>
                  </TouchableOpacity>
                  <View style={styles.todoContainer}>
                    <Text style={styles.todoText}>{todo}</Text>
                  </View>
                </SwipeRow>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  // containers
  appContainer: {
    backgroundColor: '#ccc',
    height: '100%',
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#94a',
    padding: 20,
    borderColor: '#000',
    borderBottomWidth: 3,
    borderStyle: 'solid',
  },
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#000',
    borderBottomWidth: 3,
    borderStyle: 'solid',
    backgroundColor: '#333',
  },

  // elements
  todoText: {
    fontSize: 24,
    marginVertical: 20,
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#b6c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusImage: {
    height: 45,
    width: 45,
  },
  todoInput: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    backgroundColor: '#fff',
    width: 280,
    borderColor: '#000',
    borderRightWidth: 3,
    borderStyle: 'solid',
  },
  deleteButton: {
    backgroundColor: '#d65',
    height: '100%',
    justifyContent: 'center',
  },
  todoList: {
    backgroundColor: '#000',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
});
