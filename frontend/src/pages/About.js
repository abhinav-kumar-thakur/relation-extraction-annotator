import { withData } from "../context/dataContext";


const About = (props) => {
    const {dataContext} = props;
    const {state: dataState, dispatch: dataDispatch} = dataContext;
    return `this is ${dataState.name}`
};


export default withData(About);

// https://github.com/jagatjeevan/context-reducer-react