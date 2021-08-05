import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";

let PageCenter: React.FC = () => {
  return <div>pageCenter</div>;
};

PageCenter = injectIntl(PageCenter);
PageCenter = inject("global")(PageCenter);
PageCenter = observer(PageCenter);
export default PageCenter;
