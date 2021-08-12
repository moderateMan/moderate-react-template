import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Switch } from "antd";
import useStores from "@COMMON/hooks/useStores";
import { observer } from "mobx-react";
import { getUrlParam } from "@COMMON/utils";
import CommonWrapper from "@COMMON/components/wrapper";
import WithMdHoc from "@COMMON/hocs/withMdHoc";

type DocPropsT = {
  wrapperByMd: any;
} & RouteComponentProps;

type MatchT = {
  params: {
    id?: string;
  };
};

let document: React.FC<DocPropsT> = observer((props) => {
  const { global } = useStores();
  const { changeParams, isRandomTheme } = global;
  const {
    wrapperByMd: WrapperByMd,
    match,
    location: { search },
  } = props;
  const [md, setMd] = useState<{ default: string }>({ default: "" });
  let {
    params: { id },
  }: MatchT = match;
  let docPath = getUrlParam(decodeURIComponent(search), "docPath");
  useEffect(() => {
    if (docPath) {
      id = docPath;
    }
    import("DOCS/" + id).then((data) => {
      setMd(data);
    });
  }, [id, docPath]);
  return (
    <div className="markdown-body" style={{ width: "100%", height: "100%" }}>
      <CommonWrapper>
        <div style={{ position: "absolute", right: 50 }}>
          随机主题：
          <Switch
            onChange={(value) => {
              changeParams({
                isRandomTheme: value,
              });
            }}
            checked={isRandomTheme}
          ></Switch>
        </div>
        <div style={{ marginBottom: 99 }}>
          <WrapperByMd isRandomTheme={isRandomTheme} md={md.default} />
        </div>
      </CommonWrapper>
    </div>
  );
});

export default WithMdHoc(document);
