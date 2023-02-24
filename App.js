import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { logoutUser } from './components/Auth/Services/client';
import {
  authenticateUser,
  setUserAuthenticationToken,
} from './redux/authSlice';
import { store } from './redux/store';

import HomeScreen from './screens/HomeScreen';
import LandingScreen from './screens/LandingScreen';
import LoginInScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';

const Stack = createNativeStackNavigator();

//* if user is authenticated then authenticated stack should be used, otherwise use auth stack
//* if token is present then user is authenticated -> authenticated stack
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        title: '',
        headerTransparent: true,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name='Landing Screen'
        component={LandingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name='Sign Up' component={SignUpScreen} />
      <Stack.Screen name='Sign In' component={LoginInScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const dispatch = useDispatch();
  async function logout() {
    await logoutUser();
    console.log('logging out');
    dispatch(setUserAuthenticationToken(''));
    dispatch(authenticateUser(false));
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home Screen'
        component={HomeScreen}
        options={() => ({
          headerLeft: () => <Button title='logout' onPress={logout} />,
        })}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { token } = useSelector((state) => state.auth);
  console.log('app.js token', token);
  return (
    <NavigationContainer>
      {!token && <AuthStack />}
      {token && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </>
  );
}
