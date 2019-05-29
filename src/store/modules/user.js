export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    type: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateType (state, type) {
      state.type = type
    }
  }
}
