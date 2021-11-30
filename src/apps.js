const {APP_SUB_VUE,NODE_ENV} = process.env;
const microApps = [
  {
    name: 'sub-vue',
    entry: NODE_ENV !== "development" ?'/subapps/vue/':process.env.APP_SUB_VUE,
    activeRule: '#/pageCenter/qk/vue',
    container: '#sub-View-vue',
  },
  {
    name: 'sub-react', 
    entry: NODE_ENV !== "development" ?'/subapps/react/':process.env.APP_SUB_REACT,
    activeRule: '#/pageCenter/qk/react',
    container: '#sub-View-react',
  }
]

const apps = microApps.map(item => {
  return {
    ...item,
  }
})

export default apps
