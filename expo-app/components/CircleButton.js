import { View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CircleButton({type, border, onPress }) {
  if (type === 'add'){
    return (
      <View style={[styles.circleButtonContainer, {borderColor:border, width: 150, height: 150, borderRadius:75, padding:7}]}>
        <Pressable style={[styles.circleButton, {borderRadius:75}]} onPress={onPress}>
          <MaterialIcons name="add" size={64} color="black" />
        </Pressable>
      </View>
    );
  }

  if (type === 'settings') {
    return (
      <View style={[styles.circleButtonContainer, {borderColor:border, padding:0, width:60, height:60, borderRadius:30}]}>
      <Pressable style={[styles.circleButton, {backgroundColor:'transparent'}]} onPress={onPress}>
        <MaterialIcons name="settings" size={28} color="#C3CBCA" />
      </Pressable>
    </View>  
    )
  }

  if (type === 'exit-top') {
    return (
      <View style={[styles.circleButtonContainer, {borderColor:border, padding:0, width:60, height:60, borderRadius:30}]}>
      <Pressable style={[styles.circleButton, {backgroundColor:'white'}]} onPress={onPress}>
        <MaterialIcons name="exit-to-app" size={28} color="black" />
      </Pressable>
    </View>  
    )
  }

  if (type === 'exit-top-2') {
    return (
      <View style={[styles.circleButtonContainer, {borderColor:border, padding:0, width:60, height:60, borderRadius:30}]}>
      <Pressable style={[styles.circleButton, {backgroundColor:'transparent'}]} onPress={onPress}>
        <AntDesign name="closesquare" size={32} color="black" />
      </Pressable>
    </View>  
    )
  }

  if (type === 'return-2') {
    return (
      <View style={[styles.circleButtonContainer, {borderColor:border, padding:0, width:60, height:60, borderRadius:30}]}>
      <Pressable style={[styles.circleButton, {backgroundColor:'transparent'}]} onPress={onPress}>
        <AntDesign name="leftsquare" size={32} color="white" />
      </Pressable>
    </View>  
    )
  }

  if (type === 'return') {
    return (
      <View style={[styles.circleButtonContainer, {borderColor:border, padding:0, width:60, height:60, borderRadius:30}]}>
      <Pressable style={[styles.circleButton, {backgroundColor:'transparent'}]} onPress={onPress}>
        <AntDesign name="leftsquare" size={32} color="black" />
      </Pressable>
    </View>  
    )
  }


  return (
    <View style={[styles.circleButtonContainer, {borderColor:border}]}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        <AntDesign name="questioncircleo" size={38} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 10,
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
  },
});