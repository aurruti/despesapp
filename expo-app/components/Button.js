import {StyleSheet, View, Pressable, Text} from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Button({label, theme, onPress, background}) {
  if (theme === "blanc-exc") {
    return (
      <View style={[styles.buttonContainerHalf, {borderWidth: 4, borderColor: "ffd33d", borderRadius: 8}]}>
        <Pressable
          style={[styles.button, {backgroundColor: "#fff"}]}
          onPress={onPress}
        >
        <FontAwesome
          name="exclamation"
          size={18}
          color="#25292e"
        />
        <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }
  if (theme === "spreadsheet") {
    return (
      <View style={[styles.buttonContainerHalf, {borderWidth: 1, borderColor: "ffd33d", borderRadius: 8}]}>
        <Pressable
          style={[styles.button, {backgroundColor: "#C3CBCA"}]}
          onPress={onPress}
        >
        <MaterialCommunityIcons name="google-spreadsheet" size={18} color="black" />
        <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }
  if (theme === "month") {
    return (
      <View style={[styles.buttonContainerHalf, {borderWidth: 1, borderColor: "ffd33d", borderRadius: 8}]}>
        <Pressable
          style={[styles.button, {backgroundColor: "#C3CBCA"}]}
          onPress={onPress}
        >
        <MaterialCommunityIcons name="calendar-month" size={18} color="black" />
        <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  if (theme==='addspend') {
    return (
      <View>
        <Pressable
          style={[styles.symbolButton, {backgroundColor: "#6CD049"}]}
          onPress={onPress}
        >
        <MaterialCommunityIcons name="send" size={24} color="white" />
        </Pressable>
      </View>
    )
  }

  if (theme==='addtype') {
    return (
      <View>
        <Pressable
          style={[styles.symbolButton, {backgroundColor: "#D3BD31"}]}
          onPress={onPress}
        >
        <MaterialCommunityIcons name="playlist-plus" size={24} color="black" />
        </Pressable>
      </View>
    )
  }

  if (theme==='change-time') {
    return (
      <View>
        <Pressable
          style={[styles.symbolButton, {backgroundColor: "#A2DDD8"}]}
          onPress={onPress}
        >
        <MaterialCommunityIcons name="calendar-refresh" size={24} color="black" />
        </Pressable>
      </View>
    )
  }

  if (theme==='removetype') {
    return (
      <View style={[styles.buttonContainerHalf, {width:40, height:30, borderWidth: 1, borderColor: "ffd33d", borderRadius: 5}]}>
        <Pressable
          style={[styles.symbolButton, {backgroundColor: ""}]}
          onPress={onPress}
        >
        <MaterialCommunityIcons name="playlist-remove" size={24} color="black" />
        </Pressable>
      </View>
    )
  }
   if (theme==="colorpicker") {
     return (
      <View style={[styles.buttonContainerHalf, {width:30, height:30, borderWidth: 0, borderColor: "ffd33d", borderRadius: 5}]}>
        <Pressable
          style={[styles.symbolButton, {backgroundColor: background}]}
          onPress={onPress}
        >
        <MaterialCommunityIcons name="invert-colors" size={24} color="black" />
        </Pressable>
      </View>
    )
   }


  if (theme === "addtypetext") {
    return (
      <View style={[styles.buttonContainerHalf, {borderWidth: 0, borderColor: "transparent", borderRadius: 3}]}>
        <Pressable
          style={[styles.button, {backgroundColor: "#DCCD6F"}]}
          onPress={onPress}
        >
        <MaterialCommunityIcons name="playlist-plus" size={18} color="black" />
        <Text style={[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  if (theme === "type-unselected") {
    return (
      <View style={[styles.buttonContainerThird, {borderWidth: 0, borderColor: "transparent", borderRadius: 3}]}>
        <Pressable
          style={[styles.button, {backgroundColor: background}]}
          onPress={onPress}
        >
        <Text style={[styles.buttonLabel, {color: "#25292e", fontSize:14}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  if (theme === "type-selected") {
    return (
      <View style={[styles.buttonContainerThird, {borderWidth: 2, borderColor: "#6CD049", borderRadius: 7}]}>
        <Pressable
          style={[styles.button, {backgroundColor: background}]}
          onPress={onPress}
        >
        <Text style={[styles.buttonLabel, {color: "#25292e", fontSize:14}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={[styles.buttonContainer, {borderWidth: 1, borderColor: "ffd33d", borderRadius: 5}]}>
      <Pressable style={[styles.button, {borderRadius: 3, backgroundColor : "#C3CBCA"}]} onPress={onPress}>
        <FontAwesome name="code" size={20} color='blue'/>
        <Text style={[styles.buttonLabel, {color: "black"}]}>{label}</Text>
      </Pressable>
    </View>
  )

}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  buttonContainerHalf: {
    width: 160,
    height: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  buttonContainerThird: {
    width: '31%',
    height: 50,
    marginHorizontal: 2,
    marginBottom:2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  symbolButton : {
    width:70,
    height:50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  button: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    paddingLeft : 5,
  }

})