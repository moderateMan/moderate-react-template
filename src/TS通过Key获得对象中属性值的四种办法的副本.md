# js 的情景

## 数据对象

```
export const routesMap = {
    templates: {
        name: "commonTitle_nest",
        icon: "thunderbolt",
        path: "/pageCenter/nestRoute",
        exact: true,
        redirect: "/pageCenter/light",
        key: uuid()
    },

    login: {
        name: "commonTitle_login",
        path: "/pageCenter/login",
        exact: true,
        component: lazyImport(() =>
            import('./login/index')
        ),
        key: uuid()
    },

    moderate: {
        path: "/pageCenter/moderate",
        name: "Moderate of React",
        icon: "fire",
        isNoFormat:true,
        redirect: "/pageCenter/start",
        key: uuid()
    },
}
```

## 取值的逻辑

```js
if (typeof pathKey === "object") {
  let queryData = Object.entries(pathKey)[0];
  route = Object.values(routesMap).find((item) => {
    let pKey = queryData[0];
    return item[pKey] == queryData[1];
  });
}
```

# 第一种：修改 Tsconfig

```
{
  "compilerOptions": {
    ...
    "suppressImplicitAnyIndexErrors": true
    ...
  },
  ...
}

```

不推荐

# 第二种：使用 any

## 取值的逻辑

```ts
if (typeof pathKey === "object") {
  let queryData = Object.entries(pathKey)[0];
  route = Object.values(routesMap).find((item: any) => {
    let pKey = queryData[0];
    return item[pKey] == queryData[1];
  });
}
```

不推荐，相当于没用 ts

# 第三种：借助 keyof

## 取值的逻辑

```ts
if (typeof pathKey === "object") {
  let queryData = Object.entries(pathKey)[0];
  route = Object.values(routesMap).find((item) => {
    let pKey = queryData[0];
    return item[pKey as keyof typeof item] == queryData[1];
  });
}
```

尚可

# 第四种：优雅

## 约束数据对象

```js
type routesMapItemType = {
  name: string,
  icon?: string,
  path: string,
  exact?: boolean,
  redirect?: string,
  key: string,
  component?: any,
  isNoFormat?: boolean,
};

//不用每条属性都写，这么写可以更好的扩展，路架构强调的
type routesMapType = { [key: string]: routesMapItemType };

export const routesMap: routesMapType = {
  templates: {
    name: "commonTitle_nest",
    icon: "thunderbolt",
    path: "/pageCenter/nestRoute",
    exact: true,
    redirect: "/pageCenter/light",
    key: uuid(),
  },

  login: {
    name: "commonTitle_login",
    path: "/pageCenter/login",
    exact: true,
    component: lazyImport(() => import("./login/index")),
    key: uuid(),
  },

  moderate: {
    path: "/pageCenter/moderate",
    name: "Moderate of React",
    icon: "fire",
    isNoFormat: true,
    redirect: "/pageCenter/start",
    key: uuid(),
  },
};
```

## 取值的逻辑

### 文件中引入类型

```ts
type routesMapItemType = {
  name: string;
  icon?: string;
  path: string;
  exact?: boolean;
  redirect?: string;
  key: string;
  component?: any;
  isNoFormat?: boolean;
};
```

```ts
if (typeof pathKey === "object") {
  let queryData = Object.entries(pathKey)[0] as (keyof routesMapItemType)[];
  route = Object.values(routesMap).find((item) => {
    let pKey = queryData[0];
    return item[pKey] == queryData[1];
  });
}
```

qanglee推荐，非常悠亚。
