import { StyleSheet } from 'react-native'
import { color } from 'react-native-reanimated'


export const styles = StyleSheet.create ({
    space: {
        padding: 35,
        width:300,
        height:150
    },
    image:{
        height:'103%',
        justifyContent:'flex-end',
        opacity: .9
    },

    button:{
        backgroundColor:'#5f9ea0',
        borderColor:'red',
        width:250,
        height:50,

    },
    panel: {
        backgroundColor:'red',
        elevation:1,
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        height:40,
        width:410,
    },
    text:{
        fontSize:15,
        fontWeight:'bold'
    },
    head: {
       
        fontSize:32,
        padding:32,
        fontWeight:'bold',
        color:"white",
        backgroundColor:'#841584',
        alignItems:'center',

      },
      row: {
        padding: 8,
        borderBottomColor: "black",
        borderBottomWidth: StyleSheet.hairlineWidth
      },
      input:{
          backgroundColor: '#DFDFDF',
          width: 150,
      },
      button1:{
        backgroundColor:'#5f9ea0',
        borderColor:'black',
        borderWidth:3,
        width:200,
        alignItems:'center',
        marginLeft:200,
        height: 50,
        justifyContent:'center',
        borderRadius:10,
        
    },
    button2:{
        backgroundColor:'#5f9ea0',
        borderColor:'black',
        borderWidth:3,
        width:200,
        alignItems:'center',
        marginLeft:200,
        height: 50,
        justifyContent:'center',
        borderRadius:10,
        marginTop:20
    },
    buttonText:{
        fontSize:25,
        fontWeight: 'bold'
    }

})



