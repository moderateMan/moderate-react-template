const microApps = [
  {
    name: 'sub-vue',
    entry: process.env.APP_SUB_VUE,
    activeRule: '/pageCenter/qk/vue',
    container: '#sub-View-vue',
  },
  {
    name: 'sub-react', 
    entry: process.env.APP_SUB_REACT,
    activeRule: '/pageCenter/qk/react',
    container: '#sub-View-react',
  }
]

const apps = microApps.map(item => {
  return {
    ...item,
  }
})

export default apps
