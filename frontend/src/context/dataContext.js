import { createContext } from "./createContext";

const initialState = {
    name: "abhinav"
}

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return {...state};
  }
};

export const { Context, Provider } = createContext(
  reducer,
  {  },
  initialState
);

export function withData(Component) {
  return function contextComponent(props) {
    return (
      <Context.Consumer>
        {(context) => <Component {...props} dataContext={context} />}
      </Context.Consumer>
    );
  };
}