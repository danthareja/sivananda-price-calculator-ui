import qs from 'qs'

export default function makeStoreEnhancer(params) {
  return next => (reducer, initialState, enhancer) => {
    const store = next(reducer, initialState, enhancer)

    observeStore(
      store,
      state => qs.stringify(
        Object.keys(params).reduce((obj, key) => {
          obj[key] = params[key].selector(state)
          return obj
        }, {}),
      ),
      hash => location.hash = hash
    )

    return store
  }
}

function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
