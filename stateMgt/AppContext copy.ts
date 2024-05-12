import React, { createContext, useContext, useReducer } from "react";
import { View } from "react-native";

interface StateProps {
  expoToken: string | null;
}
interface ActionProps {
  type: string;
  payload: string;
}

const initialState: StateProps = {
  expoToken: null,
};

const appReducer = (state: StateProps, action: ActionProps) => {
  switch (action.type) {
    case "ADD_TOKEN":
      return { ...state, expoToken: action.payload };
    case "GET_TOKEN":
      return state;
    case "REMOVE_TOKEN":
      return initialState;
    default:
      return state;
  }
};
interface AppContextType {
  state: StateProps;
  dispatch: React.Dispatch<ActionProps>;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <View>
      <AppContext.Provider value={{ state, dispatch }}>
        {children}
      </AppContext.Provider>
    </View>
  );
};

export const useAppContext = () => useContext(AppContext);
