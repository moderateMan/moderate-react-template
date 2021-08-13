const lightHomeStoreN = {
  // 存放数据
  state: {
    number: 0,
    testValue: "123",
  },
  // state的映射
  maps: {
    isEven: ["number", (number: number) => number % 2 === 0],
  },
  // actions用来修改state
  actions: {
    inc: (number: number) => ({ number: number + 1 }),
    dec: (number: number) => ({ number: number - 1 }),
    // 这里是异步更新state中的name数据
    asyncAction: (testValue: string) => {
      debugger
      return Promise.resolve({ testValue })
    },
    // 这里是同步更新state中的name数据
    syncAction: (testValue: string) => {
      debugger
      return { testValue: testValue };
    },
  },
};

export default lightHomeStoreN;
