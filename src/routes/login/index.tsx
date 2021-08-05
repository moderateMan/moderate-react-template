import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";

let App: React.FC = () => {
  return <div>login</div>;
};

App = injectIntl(App);
App = inject("global")(App);
App = observer(App);
export default App;
