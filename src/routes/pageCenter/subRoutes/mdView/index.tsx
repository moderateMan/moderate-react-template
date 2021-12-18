import React, { useEffect, useState,memo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Switch } from "antd";
import { observer,inject } from "mobx-react";
import { getUrlParam } from "@COMMON/utils";
import CommonWrapper from "@COMMON/components/wrapper";
import WithMdHoc from "@COMMON/hocs/withMdHoc";
import type {Global} from "@STORE/index"

type DocPropsT = {
  wrapperByMd: any;
  global:Global
} & RouteComponentProps;

type MatchT = {
  params: {
    id?: string;
  };
};

let document: React.FC<DocPropsT> = inject("global")(observer((props) => {
  const {
    wrapperByMd: WrapperByMd,
    match,
    location: { search },
    global
  } = props;
  const { changeParams, isRandomTheme } = global;
  const [md, setMd] = useState<{ default: string }>({ default: "" });
  let {
    params: { id },
  }: MatchT = match;
  let docPath = getUrlParam(decodeURIComponent(search), "docPath");
  useEffect(() => {
    if (docPath) {
      id = docPath;
    }
    if(!id){
      id = "_intro.md"
    }
    import("DOCS/" + id).then((data) => {
      setMd(data);
    }).catch(()=>{
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
}));

export default WithMdHoc(memo(document));
